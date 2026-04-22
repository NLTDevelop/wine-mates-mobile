#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ts = require('typescript');

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, 'src');
const TS_EXTENSIONS = new Set(['.ts', '.tsx']);
const DATA_PREPARATION_METHODS = new Set(['map', 'filter', 'reduce']);
const ALLOWED_MODEL_METHODS = new Set(['appened']);
const SCALE_REQUIRED_STYLE_KEYS = new Set([
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'top',
    'left',
    'right',
    'bottom',
    'start',
    'end',
    'inset',
    'insetTop',
    'insetLeft',
    'insetRight',
    'insetBottom',
    'padding',
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'paddingStart',
    'paddingEnd',
    'paddingHorizontal',
    'paddingVertical',
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'marginStart',
    'marginEnd',
    'marginHorizontal',
    'marginVertical',
    'gap',
    'rowGap',
    'columnGap',
    'borderWidth',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
]);

const getStagedFiles = () => {
    const stdout = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' });

    return stdout
        .split('\n')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .filter((entry) => entry.startsWith('src/'))
        .filter((entry) => TS_EXTENSIONS.has(path.extname(entry)))
        .filter((entry) => !entry.endsWith('.d.ts'))
        .map((entry) => path.join(ROOT_DIR, entry))
        .filter((entry) => fs.existsSync(entry));
};

const getLineNumber = (sourceFile, position) => {
    return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
};

const hasExportModifier = (node) => {
    const modifiers = node.modifiers || [];
    return modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
};

const isHandleName = (name) => /^handle[A-Z]/.test(name);

const isJsxAttributeWithInlineArrow = (node) => {
    if (!ts.isJsxAttribute(node)) return false;
    if (!node.initializer || !ts.isJsxExpression(node.initializer)) return false;
    return Boolean(node.initializer.expression && ts.isArrowFunction(node.initializer.expression));
};

const getTypeReferenceName = (typeNode) => {
    if (!typeNode || !ts.isTypeReferenceNode(typeNode)) return null;
    if (ts.isIdentifier(typeNode.typeName)) {
        return typeNode.typeName.text;
    }
    return null;
};

const isComponentName = (name) => {
    if (!name || typeof name !== 'string') return false;
    const firstSymbol = name.charAt(0);
    return firstSymbol === firstSymbol.toUpperCase();
};

const getLine = (sourceFile, node) => getLineNumber(sourceFile, node.getStart(sourceFile));
const isOnName = (name) => /^on[A-Z]/.test(name);

const getPropertyName = (nameNode) => {
    if (!nameNode) return null;
    if (ts.isIdentifier(nameNode)) return nameNode.text;
    if (ts.isStringLiteral(nameNode) || ts.isNumericLiteral(nameNode)) return nameNode.text;
    return null;
};

const isScaleRequiredStyleProp = (propertyName) => {
    if (!propertyName) return false;
    if (SCALE_REQUIRED_STYLE_KEYS.has(propertyName)) return true;
    return propertyName.startsWith('padding') || propertyName.startsWith('margin');
};

const isScalePrefixedCall = (node) => {
    if (!ts.isCallExpression(node)) return false;
    if (ts.isIdentifier(node.expression)) {
        return node.expression.text.startsWith('scale');
    }
    if (ts.isPropertyAccessExpression(node.expression)) {
        return node.expression.name.text.startsWith('scale');
    }
    return false;
};

const isNonZeroNumericLiteral = (node) => {
    if (ts.isNumericLiteral(node)) {
        return Number(node.text) !== 0;
    }

    if (
        ts.isPrefixUnaryExpression(node) &&
        (node.operator === ts.SyntaxKind.MinusToken || node.operator === ts.SyntaxKind.PlusToken) &&
        ts.isNumericLiteral(node.operand)
    ) {
        return Number(node.operand.text) !== 0;
    }

    return false;
};

const isStyleSheetCreateCall = (node) => {
    return (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === 'StyleSheet' &&
        node.expression.name.text === 'create'
    );
};

const isStyleFile = (relativePath) => /(^|\/)styles\.tsx?$/.test(relativePath);
const isModelFile = (relativePath) => relativePath.includes('/models/');
const isUiFile = (relativePath) => relativePath.includes('/UI/');
const isUiComponentFile = (relativePath, isTsxFile) => isTsxFile && isUiFile(relativePath) && !relativePath.includes('/presenters/');

const isFunctionLikeDeclaration = (node) => {
    return (
        ts.isFunctionDeclaration(node) ||
        (
            ts.isVariableDeclaration(node) &&
            node.initializer &&
            (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
        )
    );
};

const getFunctionLikeBody = (node) => {
    if (ts.isFunctionDeclaration(node)) {
        return node.body || null;
    }

    if (
        ts.isVariableDeclaration(node) &&
        node.initializer &&
        (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
        return node.initializer.body;
    }

    return null;
};

const isMethodCallByName = (node, methodNames) => {
    if (!ts.isCallExpression(node)) return false;
    if (!ts.isPropertyAccessExpression(node.expression)) return false;
    return methodNames.has(node.expression.name.text);
};

const isIdentifierCallByName = (node, name) => {
    return ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === name;
};

const isUseMemoCallWithGetStyles = (node) => {
    if (!isIdentifierCallByName(node, 'useMemo')) return false;
    const callback = node.arguments?.[0];
    if (!callback) return false;
    if (!ts.isArrowFunction(callback) && !ts.isFunctionExpression(callback)) return false;
    return containsGetStylesCall(callback.body);
};

const getFunctionLikeName = (node) => {
    if (ts.isFunctionDeclaration(node) && node.name) {
        return node.name.text;
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
        return node.name.text;
    }
    return null;
};

const isStylesVariableWithStyleSheetCreate = (statement) => {
    if (!ts.isVariableStatement(statement)) return false;
    if (statement.declarationList.declarations.length !== 1) return false;

    const [declaration] = statement.declarationList.declarations;
    if (!ts.isIdentifier(declaration.name) || declaration.name.text !== 'styles') return false;
    if (!declaration.initializer) return false;
    return isStyleSheetCreateCall(declaration.initializer);
};

const isReturnStylesStatement = (statement) => {
    return (
        ts.isReturnStatement(statement) &&
        Boolean(statement.expression) &&
        ts.isIdentifier(statement.expression) &&
        statement.expression.text === 'styles'
    );
};

const isReturnStyleSheetCreateStatement = (statement) => {
    return (
        ts.isReturnStatement(statement) &&
        Boolean(statement.expression) &&
        isStyleSheetCreateCall(statement.expression)
    );
};

const validateGetStylesTemplate = (sourceFile, node, violations) => {
    const body = getFunctionLikeBody(node);

    if (!body || !ts.isBlock(body)) {
        violations.push({
            line: getLine(sourceFile, node),
            rule: 'GetStylesTemplateEnforced',
            message: 'getStyles must declare "const styles = StyleSheet.create(...)" and return "styles".',
        });
        return;
    }

    const hasStylesDeclaration = body.statements.some((statement) => isStylesVariableWithStyleSheetCreate(statement));
    const hasReturnStyles = body.statements.some((statement) => isReturnStylesStatement(statement));
    const hasDirectReturnStyleSheetCreate = body.statements.some((statement) => isReturnStyleSheetCreateStatement(statement));

    if (!hasStylesDeclaration || !hasReturnStyles || hasDirectReturnStyleSheetCreate) {
        violations.push({
            line: getLine(sourceFile, node),
            rule: 'GetStylesTemplateEnforced',
            message: 'Use getStyles template: const styles = StyleSheet.create(...); return styles;',
        });
    }
};

const collectDataPreparationViolationsInComponent = (sourceFile, functionNode, violations) => {
    const body = getFunctionLikeBody(functionNode);
    if (!body || !ts.isBlock(body)) return;

    const walk = (node) => {
        if (isMethodCallByName(node, DATA_PREPARATION_METHODS)) {
            const methodName = node.expression.name.text;
            violations.push({
                line: getLine(sourceFile, node),
                rule: 'NoDataPreparationInComponent',
                message: `Data preparation via "${methodName}" inside UI component is forbidden. Move to presenter/hook.`,
            });
        }

        if (isIdentifierCallByName(node, 'useCallback')) {
            violations.push({
                line: getLine(sourceFile, node),
                rule: 'NoDataPreparationInComponent',
                message: 'useCallback inside UI component is forbidden. Move logic to presenter/hook.',
            });
        }

        if (isIdentifierCallByName(node, 'useMemo') && !isUseMemoCallWithGetStyles(node)) {
            violations.push({
                line: getLine(sourceFile, node),
                rule: 'NoDataPreparationInComponent',
                message: 'Only useMemo for getStyles is allowed inside UI component.',
            });
        }

        ts.forEachChild(node, walk);
    };

    ts.forEachChild(body, walk);
};

const collectScaleViolationsFromObject = (sourceFile, objectNode, violations) => {
    const walkStyleObject = (styleObject) => {
        styleObject.properties.forEach((property) => {
            if (!ts.isPropertyAssignment(property)) return;

            const propertyName = getPropertyName(property.name);
            const valueNode = property.initializer;

            if (
                isScaleRequiredStyleProp(propertyName) &&
                isNonZeroNumericLiteral(valueNode)
            ) {
                violations.push({
                    line: getLine(sourceFile, property),
                    rule: 'StyleValuesMustUseScale',
                    message: `Style property "${propertyName}" must use a scale* function for non-zero numeric values.`,
                });
            }

            if (ts.isObjectLiteralExpression(valueNode)) {
                walkStyleObject(valueNode);
                return;
            }

            if (isScaleRequiredStyleProp(propertyName) && ts.isCallExpression(valueNode) && !isScalePrefixedCall(valueNode)) {
                violations.push({
                    line: getLine(sourceFile, property),
                    rule: 'StyleValuesMustUseScale',
                    message: `Style property "${propertyName}" must call a function whose name starts with "scale".`,
                });
            }
        });
    };

    walkStyleObject(objectNode);
};

const containsGetStylesCall = (node) => {
    let found = false;

    const walk = (current) => {
        if (found || !current) return;
        if (
            ts.isCallExpression(current) &&
            ts.isIdentifier(current.expression) &&
            current.expression.text === 'getStyles'
        ) {
            found = true;
            return;
        }
        ts.forEachChild(current, walk);
    };

    walk(node);
    return found;
};

const isUseMemoWithGetStyles = (initializer) => {
    if (!initializer || !ts.isCallExpression(initializer)) return false;
    if (!ts.isIdentifier(initializer.expression) || initializer.expression.text !== 'useMemo') return false;
    const callback = initializer.arguments?.[0];
    if (!callback) return false;

    if (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) {
        if (containsGetStylesCall(callback.body)) {
            return true;
        }
    }

    return false;
};

const getFunctionLikeFirstParamTypeName = (node) => {
    if (ts.isFunctionDeclaration(node)) {
        return getTypeReferenceName(node.parameters?.[0]?.type);
    }

    if (
        ts.isVariableDeclaration(node) &&
        node.initializer &&
        (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
        const firstParamType = getTypeReferenceName(node.initializer.parameters?.[0]?.type);
        if (firstParamType) return firstParamType;

        const declaredType = node.type;
        if (declaredType && ts.isTypeReferenceNode(declaredType) && declaredType.typeArguments?.length) {
            const candidate = getTypeReferenceName(declaredType.typeArguments[0]);
            if (candidate) return candidate;
        }
    }

    return null;
};

const toRelative = (absolutePath) => path.relative(ROOT_DIR, absolutePath);

const validateFile = (absolutePath) => {
    const fileText = fs.readFileSync(absolutePath, 'utf8');
    const scriptKind = absolutePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const sourceFile = ts.createSourceFile(absolutePath, fileText, ts.ScriptTarget.Latest, true, scriptKind);
    const relativePath = toRelative(absolutePath);
    const inPresenter = relativePath.includes('/presenters/');
    const inModel = isModelFile(relativePath);
    const isTsxFile = absolutePath.endsWith('.tsx');
    const inUiComponent = isUiComponentFile(relativePath, isTsxFile);
    const inUiFileScope = isUiFile(relativePath) && !relativePath.includes('/types/') && !relativePath.includes('/enums/');
    const inStyleFile = isStyleFile(relativePath);
    const violations = [];

    const visit = (node) => {
        if (ts.isSwitchStatement(node)) {
            violations.push({
                line: getLine(sourceFile, node),
                rule: 'SwitchCaseForbidden',
                message: 'Use if/else instead of switch-case.',
            });
        }

        if (
            inPresenter &&
            (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isEnumDeclaration(node)) &&
            hasExportModifier(node)
        ) {
            violations.push({
                line: getLine(sourceFile, node),
                rule: 'NoExportedTypesInPresenters',
                message: 'Move shared types/interfaces/enums from presenters to dedicated types/enums folders.',
            });
        }

        if (
            inUiFileScope &&
            (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isEnumDeclaration(node)) &&
            hasExportModifier(node)
        ) {
            violations.push({
                line: getLine(sourceFile, node),
                rule: 'NoExportedTypesInUiComponentFiles',
                message: 'Move exported types/interfaces/enums from UI files to dedicated types/enums folders.',
            });
        }

        if (
            (ts.isFunctionDeclaration(node) || ts.isVariableDeclaration(node)) &&
            (() => {
                const name = getFunctionLikeName(node);
                return Boolean(name && isHandleName(name));
            })()
        ) {
            const name = getFunctionLikeName(node);
            violations.push({
                line: getLine(sourceFile, node),
                rule: 'NoHandlePrefix',
                message: `Handler "${name}" must use "on*" naming instead of "handle*".`,
            });
        }

        if ((ts.isFunctionDeclaration(node) || ts.isVariableDeclaration(node))) {
            const name = getFunctionLikeName(node);
            const propsTypeName = getFunctionLikeFirstParamTypeName(node);
            if (name && isComponentName(name) && propsTypeName && propsTypeName !== 'IProps') {
                violations.push({
                    line: getLine(sourceFile, node),
                    rule: 'ComponentPropsMustBeIProps',
                    message: `Component props interface/type must be named IProps (found "${propsTypeName}").`,
                });
            }
        }

        if (isTsxFile && ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'styles') {
            const initializer = node.initializer;
            if (initializer && containsGetStylesCall(initializer) && !isUseMemoWithGetStyles(initializer)) {
                violations.push({
                    line: getLine(sourceFile, node),
                    rule: 'StylesMustBeMemoized',
                    message: 'Styles must be memoized via useMemo(() => getStyles(...), [...]) inside component.',
                });
            }
        }

        if (isJsxAttributeWithInlineArrow(node)) {
            const attributeName = node.name?.getText(sourceFile) || 'unknown';
            violations.push({
                line: getLine(sourceFile, node),
                rule: 'NoInlineArrowInJSX',
                message: `Inline arrow function in JSX prop "${attributeName}" is forbidden. Move handler to presenter.`,
            });
        }

        if (
            inPresenter &&
            (
                (ts.isFunctionDeclaration(node) && node.name && node.name.text === 'keyExtractor') ||
                (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'keyExtractor') ||
                (ts.isMethodDeclaration(node) && getPropertyName(node.name) === 'keyExtractor') ||
                (ts.isPropertyAssignment(node) && getPropertyName(node.name) === 'keyExtractor')
            )
        ) {
            violations.push({
                line: getLine(sourceFile, node),
                rule: 'NoKeyExtractorInPresenter',
                message: 'keyExtractor must stay inside UI component and must not be declared in presenter.',
            });
        }

        if (inStyleFile && isFunctionLikeDeclaration(node) && getFunctionLikeName(node) === 'getStyles') {
            validateGetStylesTemplate(sourceFile, node, violations);
        }

        if (inUiComponent && isFunctionLikeDeclaration(node)) {
            const functionName = getFunctionLikeName(node);

            if (functionName && isComponentName(functionName)) {
                collectDataPreparationViolationsInComponent(sourceFile, node, violations);
            }
        }

        if (inModel) {
            if (ts.isMethodDeclaration(node)) {
                const methodName = getPropertyName(node.name);
                if (methodName && !ALLOWED_MODEL_METHODS.has(methodName)) {
                    violations.push({
                        line: getLine(sourceFile, node),
                        rule: 'NoBusinessLogicInModel',
                        message: `Model method "${methodName}" is forbidden. Only "appened" is allowed.`,
                    });
                }
            }

            if (isFunctionLikeDeclaration(node)) {
                const functionName = getFunctionLikeName(node);

                if (functionName && functionName !== 'appened') {
                    violations.push({
                        line: getLine(sourceFile, node),
                        rule: 'NoBusinessLogicInModel',
                        message: `Function "${functionName}" is forbidden in model. Models must contain data only.`,
                    });
                }

                if (functionName && (isHandleName(functionName) || isOnName(functionName))) {
                    violations.push({
                        line: getLine(sourceFile, node),
                        rule: 'NoBusinessLogicInModel',
                        message: `Handler "${functionName}" is forbidden in model.`,
                    });
                }
            }

            if (isMethodCallByName(node, DATA_PREPARATION_METHODS)) {
                const methodName = node.expression.name.text;
                violations.push({
                    line: getLine(sourceFile, node),
                    rule: 'NoBusinessLogicInModel',
                    message: `Data transformation via "${methodName}" is forbidden in model.`,
                });
            }
        }

        if (isStyleSheetCreateCall(node)) {
            const [firstArg] = node.arguments || [];
            if (firstArg && ts.isObjectLiteralExpression(firstArg)) {
                collectScaleViolationsFromObject(sourceFile, firstArg, violations);
            }
        }

        ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return violations.map((entry) => ({ ...entry, file: relativePath }));
};

const run = () => {
    if (!fs.existsSync(SRC_DIR)) {
        console.log('[agents-check] Skip: "src" directory not found.');
        process.exit(0);
    }

    const stagedFiles = getStagedFiles();
    if (!stagedFiles.length) {
        console.log('[agents-check] No staged TS/TSX files in src. Skip.');
        process.exit(0);
    }

    const violations = stagedFiles.flatMap(validateFile);
    if (!violations.length) {
        console.log(`[agents-check] OK. Checked ${stagedFiles.length} staged file(s).`);
        process.exit(0);
    }

    console.error('[agents-check] Found AGENTS.md rule violations:');
    violations.forEach((violation) => {
        console.error(
            `  - ${violation.file}:${violation.line} [${violation.rule}] ${violation.message}`,
        );
    });
    process.exit(1);
};

run();
