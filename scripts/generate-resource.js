#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql2/promise"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path.resolve(process.cwd(), '.development.env') });
class ResourceGenerator {
    config;
    connection = null;
    constructor(config) {
        this.config = config;
    }
    async ensureConnection() {
        if (!this.connection) {
            this.connection = await mysql.createConnection(this.config);
        }
    }
    async getTables() {
        await this.ensureConnection();
        const [rows] = await this.connection.query('SHOW TABLES');
        return rows.map((row) => Object.values(row)[0]);
    }
    async getTableInfo(tableName) {
        await this.ensureConnection();
        const [rows] = await this.connection.query(`DESCRIBE \`${tableName}\``);
        const [fkRows] = await this.connection.query(`SELECT 
        COLUMN_NAME as columnName,
        REFERENCED_TABLE_NAME as referencedTableName,
        REFERENCED_COLUMN_NAME as referencedColumnName
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND REFERENCED_TABLE_NAME IS NOT NULL`, [tableName]);
        const foreignKeys = fkRows.map((fk) => ({
            columnName: fk.columnName || fk.COLUMN_NAME,
            referencedTableName: fk.referencedTableName || fk.REFERENCED_TABLE_NAME,
            referencedColumnName: fk.referencedColumnName || fk.REFERENCED_COLUMN_NAME,
        }));
        return {
            tableName,
            columns: rows,
            foreignKeys,
        };
    }
    toPascalCase(str) {
        return str
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }
    toCamelCase(str) {
        const pascal = this.toPascalCase(str);
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }
    toKebabCase(str) {
        return str
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .replace(/^-/, '');
    }
    toSnakeCase(str) {
        return str
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');
    }
    getTypeScriptType(mysqlType, nullable) {
        const type = mysqlType.toLowerCase();
        let tsType = 'string';
        if (type.includes('int') ||
            type.includes('decimal') ||
            type.includes('float') ||
            type.includes('double')) {
            tsType = 'number';
        }
        else if (type.includes('bool') || type.includes('tinyint(1)')) {
            tsType = 'boolean';
        }
        else if (type.includes('date') || type.includes('time')) {
            tsType = 'Date';
        }
        else if (type.includes('json')) {
            tsType = 'object';
        }
        return nullable ? `${tsType} | null` : tsType;
    }
    getTypeORMType(mysqlType) {
        const type = mysqlType.toLowerCase();
        if (type.includes('varchar') ||
            type.includes('char') ||
            type.includes('text')) {
            if (type.includes('text'))
                return 'text';
            return 'varchar';
        }
        else if (type.includes('int')) {
            if (type.includes('bigint'))
                return 'bigint';
            if (type.includes('smallint'))
                return 'smallint';
            if (type.includes('tinyint')) {
                return 'smallint';
            }
            return 'int';
        }
        else if (type.includes('decimal') || type.includes('numeric')) {
            return 'decimal';
        }
        else if (type.includes('float')) {
            return 'real';
        }
        else if (type.includes('double')) {
            return 'double precision';
        }
        else if (type.includes('bool') ||
            (type.includes('tinyint(1)') && !type.includes('tinyint(1) unsigned'))) {
            return 'boolean';
        }
        else if (type.includes('date') &&
            !type.includes('time') &&
            !type.includes('stamp')) {
            return 'date';
        }
        else if (type.includes('datetime') || type.includes('timestamp')) {
            return 'timestamp';
        }
        else if (type.includes('time') &&
            !type.includes('date') &&
            !type.includes('stamp')) {
            return 'time';
        }
        else if (type.includes('json')) {
            return 'jsonb';
        }
        return 'varchar';
    }
    generateEntity(tableInfo, currentCategory, currentFeaturePath) {
        const entityName = this.toPascalCase(tableInfo.tableName);
        const className = entityName.endsWith('s')
            ? entityName.slice(0, -1)
            : entityName;
        const hasNonAutoIncrementPrimary = tableInfo.columns.some((col) => col.Key === 'PRI' && !col.Extra.includes('auto_increment'));
        const hasForeignKeys = tableInfo.foreignKeys.length > 0;
        const needsManyToOne = hasForeignKeys;
        const needsJoinColumn = hasForeignKeys;
        const importParts = ['Entity', 'Column', 'PrimaryGeneratedColumn'];
        if (hasNonAutoIncrementPrimary)
            importParts.push('PrimaryColumn');
        if (needsManyToOne)
            importParts.push('ManyToOne');
        if (needsJoinColumn)
            importParts.push('JoinColumn');
        const imports = `import { ${importParts.join(', ')} } from 'typeorm';`;
        const relatedEntityImports = [];
        const relatedEntities = new Map();
        const tableToCategory = {
            users: 'accounts',
            user: 'accounts',
            promoters: 'core',
            championships: 'core',
            challenges: 'core',
            challenges_body_weight: 'core',
            challenges_style: 'core',
            challenges_type: 'core',
            ages: 'core',
            athletes: 'core',
            weights: 'core',
            registrations: 'core',
            registration_challenges: 'core',
            countrie: 'core',
            countries: 'core',
            country: 'core',
        };
        if (hasForeignKeys) {
            tableInfo.foreignKeys.forEach((fk) => {
                const refTableName = fk.referencedTableName;
                const refEntityName = this.toPascalCase(refTableName);
                const refClassName = refEntityName.endsWith('s')
                    ? refEntityName.slice(0, -1)
                    : refEntityName;
                if (!relatedEntities.has(refTableName)) {
                    relatedEntities.set(refTableName, refClassName);
                    let normalizedTableName = refTableName;
                    if (refTableName === 'user') {
                        normalizedTableName = 'users';
                    }
                    const refDirectoryName = this.toSnakeCase(normalizedTableName);
                    const refEntityFileName = this.toSnakeCase(refClassName);
                    const refCategory = tableToCategory[normalizedTableName] ||
                        tableToCategory[refTableName];
                    const sameCategory = currentCategory && refCategory === currentCategory;
                    let importPath;
                    if (sameCategory) {
                        importPath = `../${refDirectoryName}/entities/${refEntityFileName}.entity`;
                    }
                    else if (refCategory) {
                        importPath = `@features/${refCategory}/${refDirectoryName}/entities/${refEntityFileName}.entity`;
                    }
                    else {
                        importPath = `../${refDirectoryName}/entities/${refEntityFileName}.entity`;
                    }
                    relatedEntityImports.push(`import { ${refClassName} } from '${importPath}';`);
                }
            });
        }
        let entityCode = '';
        if (relatedEntityImports.length > 0) {
            entityCode += relatedEntityImports.join('\n') + '\n\n';
        }
        entityCode += `${imports}\n\n`;
        entityCode += `@Entity('${tableInfo.tableName}')\n`;
        entityCode += `export class ${className} {\n`;
        const fkColumnMap = new Map();
        tableInfo.foreignKeys.forEach((fk) => {
            fkColumnMap.set(fk.columnName.toLowerCase(), fk);
        });
        tableInfo.columns.forEach((col) => {
            const tsType = this.getTypeScriptType(col.Type, col.Null === 'YES');
            const ormType = this.getTypeORMType(col.Type);
            const columnName = this.toCamelCase(col.Field);
            const isPrimary = col.Key === 'PRI';
            const isAutoIncrement = col.Extra.includes('auto_increment');
            const isNullable = col.Null === 'YES';
            const fk = fkColumnMap.get(col.Field.toLowerCase());
            if (fk) {
                const refTableName = fk.referencedTableName;
                const refClassName = relatedEntities.get(refTableName);
                const relationshipName = this.toCamelCase(refClassName);
                entityCode += `  @ManyToOne(() => ${refClassName}, { nullable: ${isNullable}, eager: false })\n`;
                entityCode += `  @JoinColumn({ name: '${col.Field}' })\n`;
                entityCode += `  ${relationshipName}: ${refClassName};\n\n`;
                const fkOptions = [`name: '${col.Field}'`];
                if (ormType !== 'varchar' &&
                    ormType !== 'bigint' &&
                    ormType !== 'int') {
                    fkOptions.push(`type: '${ormType}'`);
                }
                if (isNullable)
                    fkOptions.push(`nullable: true`);
                entityCode += `  @Column({ ${fkOptions.join(', ')} })\n`;
                entityCode += `  ${columnName}: ${tsType};\n\n`;
            }
            else {
                let decorator = '';
                if (isPrimary && isAutoIncrement) {
                    decorator = `  @PrimaryGeneratedColumn()\n`;
                }
                else if (isPrimary) {
                    decorator = `  @PrimaryColumn({ type: '${ormType}' })\n`;
                }
                else {
                    const options = [];
                    if (ormType !== 'varchar')
                        options.push(`type: '${ormType}'`);
                    if (isNullable)
                        options.push(`nullable: true`);
                    if (col.Default !== null) {
                        if (col.Default === 'CURRENT_TIMESTAMP') {
                            options.push(`default: () => 'CURRENT_TIMESTAMP'`);
                        }
                        else if (typeof col.Default === 'string' &&
                            !col.Default.match(/^\d+$/)) {
                            options.push(`default: '${col.Default}'`);
                        }
                        else {
                            options.push(`default: ${col.Default}`);
                        }
                    }
                    decorator = `  @Column(${options.length > 0 ? `{ ${options.join(', ')} }` : ''})\n`;
                }
                entityCode += decorator;
                entityCode += `  ${columnName}: ${tsType};\n\n`;
            }
        });
        entityCode += `}\n`;
        return entityCode;
    }
    generateCreateDto(tableInfo) {
        const entityName = this.toPascalCase(tableInfo.tableName);
        const className = entityName.endsWith('s')
            ? entityName.slice(0, -1)
            : entityName;
        const dtoName = `Create${className}Dto`;
        let dtoCode = `import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';\n\n`;
        dtoCode += `export class ${dtoName} {\n`;
        tableInfo.columns.forEach((col) => {
            if (col.Extra.includes('auto_increment'))
                return;
            const columnName = this.toCamelCase(col.Field);
            const isNullable = col.Null === 'YES';
            const tsType = this.getTypeScriptType(col.Type, false);
            const validators = [];
            if (!isNullable && col.Key !== 'PRI') {
                validators.push('IsNotEmpty');
            }
            if (tsType === 'number') {
                validators.push('IsNumber');
            }
            else if (tsType === 'boolean') {
                validators.push('IsBoolean');
            }
            else if (tsType === 'Date') {
                validators.push('IsDateString');
            }
            else {
                validators.push('IsString');
            }
            if (isNullable || col.Key === 'PRI') {
                validators.push('IsOptional');
            }
            if (validators.length > 0) {
                const decorators = validators.map((v) => `  @${v}()`).join('\n');
                dtoCode += decorators + '\n';
            }
            dtoCode += `  ${columnName}${isNullable || col.Key === 'PRI' ? '?' : ''}: ${tsType};\n\n`;
        });
        dtoCode += `}\n`;
        return dtoCode;
    }
    generateUpdateDto(entityName) {
        const className = entityName.endsWith('s')
            ? entityName.slice(0, -1)
            : entityName;
        return `import { PartialType } from '@nestjs/mapped-types';\nimport { Create${this.toPascalCase(className)}Dto } from './create_${this.toSnakeCase(className)}.dto';\n\nexport class Update${this.toPascalCase(className)}Dto extends PartialType(Create${this.toPascalCase(className)}Dto) {}\n`;
    }
    generateService(tableInfo) {
        const entityName = this.toPascalCase(tableInfo.tableName);
        const entityClassName = entityName.endsWith('s')
            ? entityName.slice(0, -1)
            : entityName;
        const serviceName = `${entityName}Service`;
        const dtoName = `Create${entityClassName}Dto`;
        const updateDtoName = `Update${entityClassName}Dto`;
        const entityVarName = this.toCamelCase(entityClassName);
        const serviceVarName = this.toCamelCase(entityName) + 'Service';
        return `import { Injectable } from '@nestjs/common';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { Repository } from 'typeorm';\nimport { ${entityClassName} } from './entities/${this.toSnakeCase(entityClassName)}.entity';\nimport { ${dtoName} } from './dto/create_${this.toSnakeCase(entityClassName)}.dto';\nimport { ${updateDtoName} } from './dto/update_${this.toSnakeCase(entityClassName)}.dto';\n\n@Injectable()\nexport class ${serviceName} {\n  constructor(\n    @InjectRepository(${entityClassName})\n    private ${entityVarName}Repository: Repository<${entityClassName}>,\n  ) {}\n\n  create(create${entityClassName}Dto: ${dtoName}): Promise<${entityClassName}> {\n    const ${entityVarName} = this.${entityVarName}Repository.create(create${entityClassName}Dto);\n    return this.${entityVarName}Repository.save(${entityVarName});\n  }\n\n  findAll(): Promise<${entityClassName}[]> {\n    return this.${entityVarName}Repository.find();\n  }\n\n  findOne(id: number): Promise<${entityClassName}> {\n    return this.${entityVarName}Repository.findOne({ where: { id } });\n  }\n\n  async update(id: number, update${entityClassName}Dto: ${updateDtoName}): Promise<${entityClassName}> {\n    await this.${entityVarName}Repository.update(id, update${entityClassName}Dto);\n    return this.findOne(id);\n  }\n\n  async remove(id: number): Promise<void> {\n    await this.${entityVarName}Repository.delete(id);\n  }\n}\n`;
    }
    generateController(tableInfo) {
        const entityName = this.toPascalCase(tableInfo.tableName);
        const entityClassName = entityName.endsWith('s')
            ? entityName.slice(0, -1)
            : entityName;
        const controllerName = `${entityName}Controller`;
        const serviceName = `${entityName}Service`;
        const serviceVarName = this.toCamelCase(entityName) + 'Service';
        const dtoName = `Create${entityClassName}Dto`;
        const updateDtoName = `Update${entityClassName}Dto`;
        const routeName = this.toKebabCase(tableInfo.tableName);
        return `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';\nimport { ${serviceName} } from './${this.toSnakeCase(entityName)}.service';\nimport { ${dtoName} } from './dto/create_${this.toSnakeCase(entityClassName)}.dto';\nimport { ${updateDtoName} } from './dto/update_${this.toSnakeCase(entityClassName)}.dto';\n\n@Controller('${routeName}')\nexport class ${controllerName} {\n  constructor(private readonly ${serviceVarName}: ${serviceName}) {}\n\n  @Post()\n  create(@Body() create${entityClassName}Dto: ${dtoName}) {\n    return this.${serviceVarName}.create(create${entityClassName}Dto);\n  }\n\n  @Get()\n  findAll() {\n    return this.${serviceVarName}.findAll();\n  }\n\n  @Get(':id')\n  findOne(@Param('id') id: string) {\n    return this.${serviceVarName}.findOne(+id);\n  }\n\n  @Patch(':id')\n  update(@Param('id') id: string, @Body() update${entityClassName}Dto: ${updateDtoName}) {\n    return this.${serviceVarName}.update(+id, update${entityClassName}Dto);\n  }\n\n  @Delete(':id')\n  remove(@Param('id') id: string) {\n    return this.${serviceVarName}.remove(+id);\n  }\n}\n`;
    }
    generateModule(tableInfo) {
        const entityName = this.toPascalCase(tableInfo.tableName);
        const entityClassName = entityName.endsWith('s')
            ? entityName.slice(0, -1)
            : entityName;
        const moduleName = `${entityName}Module`;
        const serviceName = `${entityName}Service`;
        const controllerName = `${entityName}Controller`;
        return `import { Module } from '@nestjs/common';\nimport { TypeOrmModule } from '@nestjs/typeorm';\nimport { ${serviceName} } from './${this.toSnakeCase(entityName)}.service';\nimport { ${controllerName} } from './${this.toSnakeCase(entityName)}.controller';\nimport { ${entityClassName} } from './entities/${this.toSnakeCase(entityClassName)}.entity';\n\n@Module({\n  imports: [TypeOrmModule.forFeature([${entityClassName}])],\n  controllers: [${controllerName}],\n  providers: [${serviceName}],\n  exports: [${serviceName}],\n})\nexport class ${moduleName} {}\n`;
    }
    async generateResource(tableName, featurePath = 'src/features', category) {
        const tableInfo = await this.getTableInfo(tableName);
        const entityName = this.toPascalCase(tableName);
        const className = entityName.endsWith('s')
            ? entityName.slice(0, -1)
            : entityName;
        const resourceSnakeName = this.toSnakeCase(tableName);
        const entitySnakeName = this.toSnakeCase(className);
        const baseDir = category
            ? path.join(process.cwd(), featurePath, category, resourceSnakeName)
            : path.join(process.cwd(), featurePath, resourceSnakeName);
        const featureDir = baseDir;
        const dtoDir = path.join(featureDir, 'dto');
        const entityDir = path.join(featureDir, 'entities');
        [featureDir, dtoDir, entityDir].forEach((dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
        fs.writeFileSync(path.join(entityDir, `${entitySnakeName}.entity.ts`), this.generateEntity(tableInfo, category, featurePath));
        fs.writeFileSync(path.join(dtoDir, `create_${entitySnakeName}.dto.ts`), this.generateCreateDto(tableInfo));
        fs.writeFileSync(path.join(dtoDir, `update_${entitySnakeName}.dto.ts`), this.generateUpdateDto(className));
        fs.writeFileSync(path.join(featureDir, `${resourceSnakeName}.service.ts`), this.generateService(tableInfo));
        fs.writeFileSync(path.join(featureDir, `${resourceSnakeName}.controller.ts`), this.generateController(tableInfo));
        fs.writeFileSync(path.join(featureDir, `${resourceSnakeName}.module.ts`), this.generateModule(tableInfo));
        console.log(`✅ Generated resource for table: ${tableName}`);
        console.log(`   Location: ${featureDir}`);
    }
    async close() {
        if (this.connection) {
            await this.connection.end();
        }
    }
}
async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('Usage: npm run generate:resource -- <table1> [table2] ... [--feature-path=<path>] [--category=<category>]');
        console.log('Example: npm run generate:resource -- users products --category=core');
        console.log('Example: npm run generate:resource -- users --feature-path=src/features/accounts');
        process.exit(1);
    }
    const mysqlConfig = {
        host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10),
        user: process.env.MYSQL_USERNAME || process.env.DB_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || process.env.DB_DATABASE || '',
    };
    const tables = args.filter((arg) => !arg.startsWith('--'));
    const featurePathArg = args.find((arg) => arg.startsWith('--feature-path='));
    const categoryArg = args.find((arg) => arg.startsWith('--category='));
    const featurePath = featurePathArg
        ? featurePathArg.split('=')[1]
        : 'src/features';
    const category = categoryArg ? categoryArg.split('=')[1] : undefined;
    if (!mysqlConfig.database) {
        console.error('❌ Error: Database name is required');
        console.error('   Set MYSQL_DATABASE or DB_DATABASE environment variable');
        console.error('   Also set: MYSQL_HOST (or DB_HOST), MYSQL_PORT (or DB_PORT),');
        console.error('            MYSQL_USERNAME (or DB_USERNAME), MYSQL_PASSWORD (or DB_PASSWORD)');
        console.error('\n   Example:');
        console.error('     MYSQL_HOST=localhost MYSQL_PORT=3306 MYSQL_USERNAME=root MYSQL_PASSWORD=pass MYSQL_DATABASE=old_db npm run generate:resource -- users');
        process.exit(1);
    }
    const generator = new ResourceGenerator(mysqlConfig);
    try {
        console.log(`📊 Connecting to MySQL database: ${mysqlConfig.database}@${mysqlConfig.host}:${mysqlConfig.port}`);
        console.log(`   (Reading structure to generate PostgreSQL-compatible entities)\n`);
        for (const table of tables) {
            await generator.generateResource(table, featurePath, category);
        }
        console.log('\n✨ All resources generated successfully!');
        console.log('\n📝 Next steps:');
        console.log('   1. Review and adjust the generated entities, DTOs, and services');
        console.log('      - Verify PostgreSQL types (especially boolean, jsonb, etc.)');
        console.log('      - Adjust relationships if needed (@OneToMany, @ManyToOne, etc.)');
        console.log('   2. Install class-validator and class-transformer if not already installed:');
        console.log('      pnpm add class-validator class-transformer');
        console.log('   3. Update database.config.ts to use PostgreSQL instead of MariaDB');
        console.log('   4. Register the new modules in app.module.ts');
    }
    catch (error) {
        console.error('❌ Error:', error?.message || 'Unknown error');
        if (error?.code === 'ECONNREFUSED') {
            console.error('   Could not connect to database. Please check your connection settings.');
        }
        process.exit(1);
    }
    finally {
        await generator.close();
    }
}
main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=generate-resource.js.map