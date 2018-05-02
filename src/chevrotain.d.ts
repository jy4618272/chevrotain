/*! chevrotain - v3.2.0 */
export as namespace chevrotain
/**
 * @param {ITokenConfig} config - The configuration for the TokenType
 * @returns {TokenType}
 */
export declare function createToken(config: {
    name: string
    categories?: TokenType | TokenType[]
    label?: string
    pattern?: RegExp | CustomPatternMatcherFunc | ICustomPattern | string
    group?: string | any
    push_mode?: string
    pop_mode?: boolean
    longer_alt?: TokenType
    /**
     * Can a String matching this token's pattern possibly contain a line terminator?
     * If true and the line_breaks property is not also true this will cause inaccuracies in the Lexer's line / column tracking.
     */
    line_breaks?: boolean
    /**
     * Possible starting characters or charCodes of the pattern.
     * These will be used to optimize the Lexer's performance.
     *
     * These are normally automatically computed, however the option to explicitly
     * specify those can enable optimizations even when the automatic analysis fails.
     *
     * e.g:
     * 1. { start_chars_hint: ["a", "b"] }
     *    * strings hints should be one character long
     *
     * 2. { start_chars_hint: [97, 98] }
     *    * number hints are the result of running ".charCodeAt(0)"
     *      on the strings
     *
     * 3. { start_chars_hint: [55357] }
     *    * For unicode characters outside the BMP use the first of their surrogate pairs.
     *    *  The '💩' character is represented by surrogate pairs: '\uD83D\uDCA9'
     *       and D83D is 55357 in decimal.
     *    * Note that "💩".charCodeAt() === 55357
     */
    start_chars_hint?: (string | number)[]
}): TokenType

//
//
//
//
//
//
//
//
//
//
//
//
//

declare class HashTable<V> {}
/**
 *  The type of custom pattern matcher functions.
 *  Matches should only be done on the start of the text.
 *  Note that this is similar to the signature of RegExp.prototype.exec
 *
 *  This should behave as if the regExp match is using a start of input anchor.
 *  So: for example if a custom matcher is implemented for Tokens matching: /\w+/
 *  The implementation of the custom matcher must implement a custom matcher for /^\w+/.
 *
 *  The Optional tokens and groups arguments enable accessing information about
 *  previously identified tokens if necessary.
 *
 *  This can be used for example to lex python like indentation.
 *  see: https://github.com/SAP/chevrotain/blob/master/examples/lexer/python_indentation/python_indentation.js
 *  for a fuller example
 */
export declare type CustomPatternMatcherFunc = (
    test: string,
    offset?: number,
    tokens?: IToken[],
    groups?: {
        [groupName: string]: IToken
    }
) => RegExpExecArray
/**
 * Interface for custom user provided token pattern matchers.
 */

export interface ICustomPattern {
    /**
     * The custom pattern implementation.
     * @see CustomPatternMatcherFunc
     */
    exec: CustomPatternMatcherFunc
}
/**
 *  This can be used to improve the quality/readability of error messages or syntax diagrams.
 *
 * @param {TokenType} clazz - A constructor for a Token subclass
 * @returns {string} - The Human readable label for a Token if it exists.
 */
export declare function tokenLabel(clazz: TokenType): string
export declare function hasTokenLabel(obj: TokenType): boolean
export declare function tokenName(obj: TokenType | Function): string

/**
 *   *
 * Things to note:
 * - "do"  {
 *          startColumn : 1, endColumn: 2,
 *          startOffset: x, endOffset: x +1} --> the range is inclusive to exclusive 1...2 (2 chars long).
 *
 * - "\n"  {startLine : 1, endLine: 1} --> a lineTerminator as the last character does not effect the Token's line numbering.
 *
 * - "'hello\tworld\uBBBB'"  {image: "'hello\tworld\uBBBB'"} --> a Token's image is the "literal" text
 *                                                              (unicode escaping is untouched).
 */
export interface IToken {
    /** The textual representation of the Token as it appeared in the text. */
    image: string
    /** Offset of the first character of the Token. */
    startOffset: number
    /** Line of the first character of the Token. */
    startLine?: number
    /** Column of the first character of the Token. */
    startColumn?: number
    /** Offset of the last character of the Token. */
    endOffset?: number
    /** Line of the last character of the Token. */
    endLine?: number
    /** Column of the last character of the Token. */
    endColumn?: number
    /** this marks if a Token does not really exist and has been inserted "artificially" during parsing in rule error recovery. */
    isInsertedInRecovery?: boolean
    /** An number index representing the type of the Token use <getTokenConstructor> to get the Token Type from a token "instance"  */
    tokenTypeIdx?: number
    /**
     * The actual Token Type of this Token "instance"
     * This is the same Object returned by the "createToken" API.
     * This property is very useful for debugging the Lexing and Parsing phases.
     */
    tokenType?: TokenType
}
export declare const EOF: TokenType
/**
 * Utility to create Chevrotain Token "instances"
 * Note that Chevrotain tokens are not real instances, and thus the instanceOf cannot be used.
 *
 * @param tokType
 * @param image
 * @param startOffset
 * @param endOffset
 * @param startLine
 * @param endLine
 * @param startColumn
 * @param endColumn
 * @returns {{image: string,
 *            startOffset: number,
 *            endOffset: number,
 *            startLine: number,
 *            endLine: number,
 *            startColumn: number,
 *            endColumn: number,
 *            tokenType}}
 */
export declare function createTokenInstance(
    tokType: TokenType,
    image: string,
    startOffset: number,
    endOffset: number,
    startLine: number,
    endLine: number,
    startColumn: number,
    endColumn: number
): IToken
/**
 * A Utility method to check if a token is of the type of the argument Token class.
 * This utility is needed because Chevrotain tokens support "categories" which means
 * A TokenType may have multiple categories, so a TokenType for the "true" literal in JavaScript
 * May be both a Keyword Token and a Literal Token.
 *
 * @param token {IToken}
 * @param tokType {TokenType}
 * @returns {boolean}
 */
export declare function tokenMatcher(token: IToken, tokType: TokenType): boolean

export interface TokenType {
    GROUP?: string
    PATTERN?: RegExp | string
    LABEL?: string
    LONGER_ALT?: TokenType
    POP_MODE?: boolean
    PUSH_MODE?: string
    LINE_BREAKS?: boolean
    CATEGORIES?: TokenType[]
    tokenName?: string
    tokenTypeIdx?: number
    categoryMatches?: number[]
    categoryMatchesMap?: {
        [tokType: number]: boolean
    }
    isParent?: boolean
}
export interface ILexingResult {
    tokens: IToken[]
    groups: {
        [groupName: string]: IToken[]
    }
    errors: ILexingError[]
}
export declare enum LexerDefinitionErrorType {
    MISSING_PATTERN = 0,
    INVALID_PATTERN = 1,
    EOI_ANCHOR_FOUND = 2,
    UNSUPPORTED_FLAGS_FOUND = 3,
    DUPLICATE_PATTERNS_FOUND = 4,
    INVALID_GROUP_TYPE_FOUND = 5,
    PUSH_MODE_DOES_NOT_EXIST = 6,
    MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE = 7,
    MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY = 8,
    MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST = 9,
    LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED = 10,
    SOI_ANCHOR_FOUND = 11,
    EMPTY_MATCH_PATTERN = 12,
    NO_LINE_BREAKS_FLAGS = 13,
    UNREACHABLE_PATTERN = 14
}
export interface ILexerDefinitionError {
    message: string
    type: LexerDefinitionErrorType
    tokenTypes?: TokenType[]
}
export interface ILexingError {
    offset: number
    line: number
    column: number
    length: number
    message: string
}
export declare type SingleModeLexerDefinition = TokenType[]
export declare type MultiModesDefinition = {
    [modeName: string]: TokenType[]
}
export interface IMultiModeLexerDefinition {
    modes: MultiModesDefinition
    defaultMode: string
}
export interface IRegExpExec {
    exec: CustomPatternMatcherFunc
}
/**
 * A subset of the regExp interface.
 * Needed to compute line/column info by a chevrotain lexer.
 */
export interface ILineTerminatorsTester {
    /**
     * Just like regExp.test
     */
    test: (text: string) => boolean
    /**
     * Just like the regExp lastIndex with the global flag enabled
     * It should be updated after every match to point to the offset where the next
     * match attempt starts.
     */
    lastIndex: number
}
export interface ILexerConfig {
    /**
     * An optional flag indicating that lexer definition errors
     * should not automatically cause an error to be raised.
     * This can be useful when wishing to indicate lexer errors in another manner
     * than simply throwing an error (for example in an online playground).
     */
    deferDefinitionErrorsHandling?: boolean
    /**
     * "full" location information means all six combinations of /(end|start)(Line|Column|Offset)/ properties.
     * "onlyStart" means that only startLine, startColumn and startOffset will be tracked
     * "onlyOffset" means that only the startOffset will be tracked.
     *
     * The less position tracking the faster the Lexer will be and the less memory used.
     * However the difference is not large (~10% On V8), thus reduced location tracking options should only be used
     * in edge cases where every last ounce of performance is needed.
     */
    positionTracking?: "full" | "onlyStart" | "onlyOffset"
    /**
     * A regExp defining custom line terminators.
     * This will be used to calculate the line and column information.
     *
     * Note that the regExp should use the global flag, for example: /\n/g
     *
     * The default is: /\n|\r\n?/g
     *
     * But some grammars have a different definition, for example in ECMAScript:
     * https://www.ecma-international.org/ecma-262/8.0/index.html#sec-line-terminators
     * U+2028 and U+2029 are also treated as line terminators.
     *
     * In that case we would use /\n|\r|\u2028|\u2029/g
     *
     * Note that it is also possible to supply an optimized RegExp like implementation
     * as only a subset of the RegExp APIs is needed, @see {ILineTerminatorsTester}
     * for details.
     *
     * keep in mind that for the default pattern: /\n|\r\n?/g an optimized implementation is already built-in.
     * This means the optimization is only relevant for lexers overriding the default pattern.
     */
    lineTerminatorsPattern?: RegExp | ILineTerminatorsTester
    /**
     * When true this flag will cause the Lexer to throw an Error
     * When it is unable to perform all of its performance optimizations.
     *
     * In addition error messages will be printed to the console with details
     * how to resolve the optimizations issues.
     *
     * Use this flag to guarantee higher lexer performance.
     * The optimizations can boost the lexer's performance anywhere from 30%
     * to 100%+ depending on the number of TokenTypes used.
     */
    ensureOptimizations?: boolean
    /**
     * Can be used to disable lexer optimizations
     * If there is a suspicion they are causing incorrect behavior.
     */
    safeMode?: boolean
}
export declare class Lexer {
    protected lexerDefinition:
        | SingleModeLexerDefinition
        | IMultiModeLexerDefinition
    static SKIPPED: string
    static NA: RegExp
    lexerDefinitionErrors: ILexerDefinitionError[]
    protected patternIdxToConfig: any
    protected charCodeToPatternIdxToConfig: any
    protected modes: string[]
    protected defaultMode: string
    protected emptyGroups: {
        [groupName: string]: IToken
    }
    /**
     * @param {SingleModeLexerDefinition | IMultiModeLexerDefinition} lexerDefinition -
     *  Structure composed of constructor functions for the Tokens types this lexer will support.
     *
     *  In the case of {SingleModeLexerDefinition} the structure is simply an array of TokenTypes.
     *  In the case of {IMultiModeLexerDefinition} the structure is an object with two properties:
     *    1. a "modes" property where each value is an array of TokenTypes.
     *    2. a "defaultMode" property specifying the initial lexer mode.
     *
     *  for example:
     *  {
     *     "modes" : {
     *     "modeX" : [Token1, Token2]
     *     "modeY" : [Token3, Token4]
     *     }
     *
     *     "defaultMode" : "modeY"
     *  }
     *
     *  A lexer with {MultiModesDefinition} is simply multiple Lexers where only one (mode) can be active at the same time.
     *  This is useful for lexing languages where there are different lexing rules depending on context.
     *
     *  The current lexing mode is selected via a "mode stack".
     *  The last (peek) value in the stack will be the current mode of the lexer.
     *
     *  Each Token Type can define that it will cause the Lexer to (after consuming an "instance" of the Token):
     *  1. PUSH_MODE : push a new mode to the "mode stack"
     *  2. POP_MODE  : pop the last mode from the "mode stack"
     *
     *  Examples:
     *       export class Attribute {
     *          static PATTERN = ...
     *          static PUSH_MODE = "modeY"
     *       }
     *
     *       export class EndAttribute {
     *          static PATTERN = ...
     *          static POP_MODE = true
     *       }
     *
     *  The TokenTypes must be in one of these forms:
     *
     *  1. With a PATTERN property that has a RegExp value for tokens to match:
     *     example: -->class Integer { static PATTERN = /[1-9]\d }<--
     *
     *  2. With a PATTERN property that has the value of the var Lexer.NA defined above.
     *     This is a convenience form used to avoid matching Token classes that only act as categories.
     *     example: -->class Keyword { static PATTERN = NA }<--
     *
     *
     *   The following RegExp patterns are not supported:
     *   a. '$' for match at end of input
     *   b. /b global flag
     *   c. /m multi-line flag
     *
     *   The Lexer will identify the first pattern that matches, Therefor the order of Token Constructors may be significant.
     *   For example when one pattern may match a prefix of another pattern.
     *
     *   Note that there are situations in which we may wish to order the longer pattern after the shorter one.
     *   For example: keywords vs Identifiers.
     *   'do'(/do/) and 'donald'(/w+)
     *
     *   * If the Identifier pattern appears before the 'do' pattern, both 'do' and 'donald'
     *     will be lexed as an Identifier.
     *
     *   * If the 'do' pattern appears before the Identifier pattern 'do' will be lexed correctly as a keyword.
     *     however 'donald' will be lexed as TWO separate tokens: keyword 'do' and identifier 'nald'.
     *
     *   To resolve this problem, add a static property on the keyword's constructor named: LONGER_ALT
     *   example:
     *
     *       export class Identifier extends Keyword { static PATTERN = /[_a-zA-Z][_a-zA-Z0-9]/ }
     *       export class Keyword Token {
     *          static PATTERN = Lexer.NA
     *          static LONGER_ALT = Identifier
     *       }
     *       export class Do extends Keyword { static PATTERN = /do/ }
     *       export class While extends Keyword { static PATTERN = /while/ }
     *       export class Return extends Keyword { static PATTERN = /return/ }
     *
     *   The lexer will then also attempt to match a (longer) Identifier each time a keyword is matched.
     *
     *
     * @param {ILexerConfig} [config=DEFAULT_LEXER_CONFIG] -
     *                  The Lexer's configuration @see {ILexerConfig} for details.
     */
    constructor(
        lexerDefinition: SingleModeLexerDefinition | IMultiModeLexerDefinition,
        config?: ILexerConfig
    )
    /**
     * Will lex(Tokenize) a string.
     * Note that this can be called repeatedly on different strings as this method
     * does not modify the state of the Lexer.
     *
     * @param {string} text - The string to lex
     * @param {string} [initialMode] - The initial Lexer Mode to start with, by default this will be the first mode in the lexer's
     *                                 definition. If the lexer has no explicit modes it will be the implicit single 'default_mode' mode.
     *
     * @returns {ILexingResult}
     */
    tokenize(text: string, initialMode?: string): ILexingResult
}

export declare enum ParserDefinitionErrorType {
    INVALID_RULE_NAME = 0,
    DUPLICATE_RULE_NAME = 1,
    INVALID_RULE_OVERRIDE = 2,
    DUPLICATE_PRODUCTIONS = 3,
    UNRESOLVED_SUBRULE_REF = 4,
    LEFT_RECURSION = 5,
    NONE_LAST_EMPTY_ALT = 6,
    AMBIGUOUS_ALTS = 7,
    CONFLICT_TOKENS_RULES_NAMESPACE = 8,
    INVALID_TOKEN_NAME = 9,
    INVALID_NESTED_RULE_NAME = 10,
    DUPLICATE_NESTED_NAME = 11,
    NO_NON_EMPTY_LOOKAHEAD = 12,
    AMBIGUOUS_PREFIX_ALTS = 13,
    TOO_MANY_ALTS = 14
}
export declare type IgnoredRuleIssues = {
    [dslNameAndOccurrence: string]: boolean
}
export declare type IgnoredParserIssues = {
    [ruleName: string]: IgnoredRuleIssues
}
export declare const END_OF_FILE: IToken
export declare type TokenMatcher = (
    token: IToken,
    tokType: TokenType
) => boolean
export declare type lookAheadSequence = TokenType[][]
export interface IParserConfig {
    /**
     * Is the error recovery / fault tolerance of the Chevrotain Parser enabled.
     */
    recoveryEnabled?: boolean
    /**
     * Maximum number of tokens the parser will use to choose between alternatives.
     */
    maxLookahead?: number
    /**
     * Used to mark parser definition errors that should be ignored.
     * For example:
     *
     * {
     *   myCustomRule : {
     *                   OR3 : true
     *                  },
     *
     *   myOtherRule : {
     *                  OPTION1 : true,
     *                  OR4 : true
     *                 }
     * }
     *
     * Be careful when ignoring errors, they are usually there for a reason :).
     */
    ignoredIssues?: IgnoredParserIssues
    /**
     * Enable This Flag to to support Dynamically defined Tokens.
     * This will disable performance optimizations which cannot work if the whole Token vocabulary is not known
     * During Parser initialization.
     */
    dynamicTokensEnabled?: boolean
    /**
     * Enable automatic Concrete Syntax Tree creation
     * For in-depth docs:
     * {@link https://github.com/SAP/chevrotain/blob/master/docs/02_Deep_Dive/concrete_syntax_tree.md}
     */
    outputCst?: boolean
    /**
     * A custom error message provider.
     * Can be used to override the default error messages.
     * For example:
     *   - Translating the error messages to a different languages.
     *   - Changing the formatting
     *   - Providing special error messages under certain conditions - missing semicolons
     */
    errorMessageProvider?: IParserErrorMessageProvider
}
export interface IRuleConfig<T> {
    /**
     * The function which will be invoked to produce the returned value for a production that have not been
     * successfully executed and the parser recovered from.
     */
    recoveryValueFunc?: () => T
    /**
     * Enable/Disable re-sync error recovery for this specific production.
     */
    resyncEnabled?: boolean
}
export interface IParserDefinitionError {
    message: string
    type: ParserDefinitionErrorType
    ruleName?: string
}
export interface IParserDuplicatesDefinitionError
    extends IParserDefinitionError {
    dslName: string
    occurrence: number
    parameter?: string
}
export interface IParserEmptyAlternativeDefinitionError
    extends IParserDefinitionError {
    occurrence: number
    alternative: number
}
export interface IParserAmbiguousAlternativesDefinitionError
    extends IParserDefinitionError {
    occurrence: number
    alternatives: number[]
}
export interface IParserUnresolvedRefDefinitionError
    extends IParserDefinitionError {
    unresolvedRefName: string
}
export interface IFollowKey {
    ruleName: string
    idxInCallingRule: number
    inRule: string
}
/**
 * OR([
 *  {ALT:XXX },
 *  {ALT:YYY },
 *  {ALT:ZZZ }
 * ])
 */
export interface IOrAlt<T> {
    NAME?: string
    ALT: () => T
}
/**
 * OR([
 *  { GATE:condition1, ALT:XXX },
 *  { GATE:condition2, ALT:YYY },
 *  { GATE:condition3, ALT:ZZZ }
 * ])
 */
export interface IOrAltWithGate<T> extends IOrAlt<T> {
    NAME?: string
    GATE: () => boolean
    ALT: () => T
}
export declare type IAnyOrAlt<T> = IOrAlt<T> | IOrAltWithGate<T>
export interface IParserState {
    errors: IRecognitionException[]
    lexerState: any
    RULE_STACK: string[]
    CST_STACK: CstNode[]
    LAST_EXPLICIT_RULE_STACK: number[]
}
export interface DSLMethodOpts<T> {
    /**
     * in-lined method name
     */
    NAME?: string
    /**
     * The Grammar to process in this method.
     */
    DEF: GrammarAction<T>
    /**
     * A semantic constraint on this DSL method
     * @see https://github.com/SAP/chevrotain/blob/master/examples/parser/predicate_lookahead/predicate_lookahead.js
     * For farther details.
     */
    GATE?: Predicate
}
export interface DSLMethodOptsWithErr<T> extends DSLMethodOpts<T> {
    /**
     *  Short title/classification to what is being matched.
     *  Will be used in the error message,.
     *  If none is provided, the error message will include the names of the expected
     *  Tokens sequences which start the method's inner grammar
     */
    ERR_MSG?: string
}
export interface OrMethodOpts<T> {
    NAME?: string
    /**
     * The set of alternatives,
     * See detailed description in @link {Parser.OR1}
     */
    DEF: IAnyOrAlt<T>[]
    /**
     * A description for the alternatives used in error messages
     * If none is provided, the error message will include the names of the expected
     * Tokens sequences which may start each alternative.
     */
    ERR_MSG?: string
}
export interface ManySepMethodOpts<T> {
    NAME?: string
    /**
     * The Grammar to process in each iteration.
     */
    DEF: GrammarAction<T>
    /**
     * The separator between each iteration.
     */
    SEP: TokenType
}
export interface AtLeastOneSepMethodOpts<T> extends ManySepMethodOpts<T> {
    /**
     *  Short title/classification to what is being matched.
     *  Will be used in the error message,.
     *  If none is provided, the error message will include the names of the expected
     *  Tokens sequences which start the method's inner grammar
     */
    ERR_MSG?: string
}
export interface ConsumeMethodOpts {
    /**
     *  A custom Error message if the Token could not be consumed.
     *  This will override any error message provided by the parser's "errorMessageProvider"
     */
    ERR_MSG?: string
    /**
     * A label to be used instead of the TokenType name in the created CST.
     */
    LABEL?: string
}
export interface SubruleMethodOpts {
    /**
     * The arguments to parameterized rules, see:
     * @link https://github.com/SAP/chevrotain/blob/master/examples/parser/parametrized_rules/parametrized.js
     */
    ARGS?: any[]
    /**
     * A label to be used instead of the TokenType name in the created CST.
     */
    LABEL?: string
}
export declare type Predicate = () => boolean
export declare type GrammarAction<OUT> = () => OUT
export declare type ISeparatedIterationResult<OUT> = {
    values: OUT[]
    separators: IToken[]
}
export declare type TokenVocabulary =
    | {
          [tokenName: string]: TokenType
      }
    | TokenType[]
    | IMultiModeLexerDefinition
/**
 * Convenience used to express an empty alternative in an OR (alternation).
 * can be used to more clearly describe the intent in a case of empty alternation.
 *
 * For example:
 *
 * 1. without using EMPTY_ALT:
 *
 *    this.OR([
 *      {ALT: () => {
 *        this.CONSUME1(OneTok)
 *        return "1"
 *      }},
 *      {ALT: () => {
 *        this.CONSUME1(TwoTok)
 *        return "2"
 *      }},
 *      {ALT: () => { // implicitly empty because there are no invoked grammar rules (OR/MANY/CONSUME...) inside this alternative.
 *        return "666"
 *      }},
 *    ])
 *
 *
 * 2. using EMPTY_ALT:
 *
 *    this.OR([
 *      {ALT: () => {
 *        this.CONSUME1(OneTok)
 *        return "1"
 *      }},
 *      {ALT: () => {
 *        this.CONSUME1(TwoTok)
 *        return "2"
 *      }},
 *      {ALT: EMPTY_ALT("666")}, // explicitly empty, clearer intent
 *    ])
 *
 */
export declare function EMPTY_ALT<T>(value?: T): () => T
/**
 * A Recognizer capable of self analysis to determine it's grammar structure
 * This is used for more advanced features requiring such information.
 * For example: Error Recovery, Automatic lookahead calculation.
 */
export declare class Parser {
    static NO_RESYNC: boolean
    static DEFER_DEFINITION_ERRORS_HANDLING: boolean
    protected static performSelfAnalysis(parserInstance: Parser): void
    protected _errors: IRecognitionException[]
    /**
     * This flag enables or disables error recovery (fault tolerance) of the parser.
     * If this flag is disabled the parser will halt on the first error.
     */
    protected recoveryEnabled: boolean
    protected dynamicTokensEnabled: boolean
    protected maxLookahead: number
    protected ignoredIssues: IgnoredParserIssues
    protected outputCst: boolean
    protected errorMessageProvider: IParserErrorMessageProvider
    protected isBackTrackingStack: any[]
    protected className: string
    protected RULE_STACK: string[]
    protected RULE_OCCURRENCE_STACK: number[]
    protected CST_STACK: CstNode[]
    protected tokensMap: {
        [fqn: string]: TokenType
    }
    /**
     * Only used internally for storing productions as they are built for the first time.
     * The final productions should be accessed from the static cache.
     */
    constructor(
        input: IToken[],
        tokenVocabulary: TokenVocabulary,
        config?: IParserConfig
    )
    errors: IRecognitionException[]
    /**
     * Resets the parser state, should be overridden for custom parsers which "carry" additional state.
     * When overriding, remember to also invoke the super implementation!
     */
    reset(): void
    isAtEndOfInput(): boolean
    getBaseCstVisitorConstructor(): {
        new (...args: any[]): ICstVisitor<any, any>
    }
    getBaseCstVisitorConstructorWithDefaults(): {
        new (...args: any[]): ICstVisitor<any, any>
    }
    getGAstProductions(): HashTable<Rule>
    getSerializedGastProductions(): ISerializedGast[]
    /**
     * @param startRuleName {string}
     * @param precedingInput {IToken[]} - The token vector up to (not including) the content assist point
     * @returns {ISyntacticContentAssistPath[]}
     */
    computeContentAssist(
        startRuleName: string,
        precedingInput: IToken[]
    ): ISyntacticContentAssistPath[]
    /**
     * @param grammarRule - The rule to try and parse in backtracking mode.
     * @param args - argumens to be passed to the grammar rule execution
     *
     * @return {TokenType():boolean} a lookahead function that will try to parse the given grammarRule and will return true if succeed.
     */
    protected BACKTRACK<T>(
        grammarRule: (...args: any[]) => T,
        args?: any[]
    ): () => boolean
    protected SAVE_ERROR(error: IRecognitionException): IRecognitionException
    protected isBackTracking(): boolean
    protected getCurrRuleFullName(): string
    protected shortRuleNameToFullName(shortName: string): string
    protected getHumanReadableRuleStack(): string[]
    /**
     *
     * A Parsing DSL method use to consume a single terminal Token.
     * a Token will be consumed, IFF the next token in the token vector matches <tokType>.
     * otherwise the parser will attempt to perform error recovery.
     *
     * The index in the method name indicates the unique occurrence of a terminal consumption
     * inside a the top level rule. What this means is that if a terminal appears
     * more than once in a single rule, each appearance must have a difference index.
     *
     * for example:
     *
     * function parseQualifiedName() {
     *    this.CONSUME1(Identifier);
     *    this.MANY(()=> {
     *       this.CONSUME1(Dot);
     *       this.CONSUME2(Identifier); // <-- here we use CONSUME2 because the terminal
     *    });                           //     'Identifier' has already appeared previously in the
     *                                  //     the rule 'parseQualifiedName'
     * }
     *
     * @param tokType - The Type of the token to be consumed.
     * @param options - optional properties to modify the behavior of CONSUME.
     */
    protected CONSUME(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     */
    protected CONSUME1(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     */
    protected CONSUME2(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     */
    protected CONSUME3(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     */
    protected CONSUME4(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     */
    protected CONSUME5(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     */
    protected CONSUME6(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     */
    protected CONSUME7(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     */
    protected CONSUME8(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     */
    protected CONSUME9(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * The Parsing DSL Method is used by one rule to call another.
     *
     * This may seem redundant as it does not actually do much.
     * However using it is mandatory for all sub rule invocations.
     * calling another rule without wrapping in SUBRULE(...)
     * will cause errors/mistakes in the Recognizer's self analysis,
     * which will lead to errors in error recovery/automatic lookahead calculation
     * and any other functionality relying on the Recognizer's self analysis
     * output.
     *
     * As in CONSUME the index in the method name indicates the occurrence
     * of the sub rule invocation in its rule.
     *
     * @param {TokenType} ruleToCall - The rule to invoke.
     * @param options - optional properties to modify the behavior of CONSUME.
     * @returns {*} - The result of invoking ruleToCall.
     */
    protected SUBRULE<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     */
    protected SUBRULE1<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     */
    protected SUBRULE2<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     */
    protected SUBRULE3<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     */
    protected SUBRULE4<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     */
    protected SUBRULE5<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     */
    protected SUBRULE6<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     */
    protected SUBRULE7<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     */
    protected SUBRULE8<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     */
    protected SUBRULE9<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * Parsing DSL Method that Indicates an Optional production
     * in EBNF notation: [...].
     *
     * Note that there are two syntax forms:
     * - Passing the grammar action directly:
     *      this.OPTION(()=> {
     *        this.CONSUME(Digit)}
     *      );
     *
     * - using an "options" object:
     *      this.OPTION({
     *        GATE:predicateFunc,
     *        DEF: ()=>{
     *          this.CONSUME(Digit)
     *        }});
     *
     * The optional 'GATE' property in "options" object form can be used to add constraints
     * to invoking the grammar action.
     *
     * As in CONSUME the index in the method name indicates the occurrence
     * of the optional production in it's top rule.
     *
     * @param  actionORMethodDef - The grammar action to optionally invoke once
     *                             or an "OPTIONS" object describing the grammar action and optional properties.
     *
     * @returns {OUT}
     */
    protected OPTION<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     */
    protected OPTION1<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     */
    protected OPTION2<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     */
    protected OPTION3<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     */
    protected OPTION4<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     */
    protected OPTION5<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     */
    protected OPTION6<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     */
    protected OPTION7<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     */
    protected OPTION8<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     */
    protected OPTION9<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * Parsing DSL method that indicates a choice between a set of alternatives must be made.
     * This is equivalent to EBNF alternation (A | B | C | D ...)
     *
     * There are a couple of syntax forms for the inner alternatives array.
     *
     * Passing alternatives array directly:
     *        this.OR([
     *           {ALT:()=>{this.CONSUME(One)}},
     *           {ALT:()=>{this.CONSUME(Two)}},
     *           {ALT:()=>{this.CONSUME(Three)}}
     *        ])
     *
     * Passing alternative array directly with predicates (GATE).
     *        this.OR([
     *           {GATE: predicateFunc1, ALT:()=>{this.CONSUME(One)}},
     *           {GATE: predicateFuncX, ALT:()=>{this.CONSUME(Two)}},
     *           {GATE: predicateFuncX, ALT:()=>{this.CONSUME(Three)}}
     *        ])
     *
     * These syntax forms can also be mixed:
     *        this.OR([
     *           {GATE: predicateFunc1, ALT:()=>{this.CONSUME(One)}},
     *           {ALT:()=>{this.CONSUME(Two)}},
     *           {ALT:()=>{this.CONSUME(Three)}}
     *        ])
     *
     * Additionally an "options" object may be used:
     * this.OR({
     *          DEF:[
     *            {ALT:()=>{this.CONSUME(One)}},
     *            {ALT:()=>{this.CONSUME(Two)}},
     *            {ALT:()=>{this.CONSUME(Three)}}
     *          ],
     *          // OPTIONAL property
     *          ERR_MSG: "A Number"
     *        })
     *
     * The 'predicateFuncX' in the long form can be used to add constraints to choosing the alternative.
     *
     * As in CONSUME the index in the method name indicates the occurrence
     * of the alternation production in it's top rule.
     *
     * @param altsOrOpts - A set of alternatives or an "OPTIONS" object describing the alternatives and optional properties.
     *
     * @returns {*} - The result of invoking the chosen alternative.
     */
    protected OR<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     */
    protected OR1<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     */
    protected OR2<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     */
    protected OR3<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     */
    protected OR4<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     */
    protected OR5<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     */
    protected OR6<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     */
    protected OR7<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     */
    protected OR8<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     */
    protected OR9<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * Parsing DSL method, that indicates a repetition of zero or more.
     * This is equivalent to EBNF repetition {...}.
     *
     * Note that there are two syntax forms:
     * - Passing the grammar action directly:
     *        this.MANY(()=>{
     *                        this.CONSUME(Comma)
     *                        this.CONSUME(Digit)
     *                      })
     *
     * - using an "options" object:
     *        this.MANY({
     *                   GATE: predicateFunc,
     *                   DEF: () => {
     *                          this.CONSUME(Comma)
     *                          this.CONSUME(Digit)
     *                        }
     *                 });
     *
     * The optional 'GATE' property in "options" object form can be used to add constraints
     * to invoking the grammar action.
     *
     * As in CONSUME the index in the method name indicates the occurrence
     * of the repetition production in it's top rule.
     *
     * @param actionORMethodDef - The grammar action to optionally invoke multiple times
     *                             or an "OPTIONS" object describing the grammar action and optional properties.
     *
     * @returns {OUT[]}
     */
    protected MANY<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     */
    protected MANY1<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     */
    protected MANY2<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     */
    protected MANY3<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     */
    protected MANY4<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     */
    protected MANY5<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     */
    protected MANY6<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     */
    protected MANY7<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     */
    protected MANY8<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     */
    protected MANY9<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * Parsing DSL method, that indicates a repetition of zero or more with a separator
     * Token between the repetitions.
     *
     * Example:
     *
     * this.MANY_SEP({
     *                  SEP:Comma,
     *                  DEF: () => {
     *                         this.CONSUME(Number};
     *                         ...
     *                       );
     *              })
     *
     * Note that because this DSL method always requires more than one argument the options object is always required
     * and it is not possible to use a shorter form like in the MANY DSL method.
     *
     * Note that for the purposes of deciding on whether or not another iteration exists
     * Only a single Token is examined (The separator). Therefore if the grammar being implemented is
     * so "crazy" to require multiple tokens to identify an item separator please use the more basic DSL methods
     * to implement it.
     *
     * As in CONSUME the index in the method name indicates the occurrence
     * of the repetition production in it's top rule.
     *
     * Note that due to current limitations in the implementation the "SEP" property must appear BEFORE the "DEF" property.
     *
     * @param options - An object defining the grammar of each iteration and the separator between iterations
     *
     * @return {ISeparatedIterationResult<OUT>}
     */
    protected MANY_SEP<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     */
    protected MANY_SEP1<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     */
    protected MANY_SEP2<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     */
    protected MANY_SEP3<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     */
    protected MANY_SEP4<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     */
    protected MANY_SEP5<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     */
    protected MANY_SEP6<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     */
    protected MANY_SEP7<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     */
    protected MANY_SEP8<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     */
    protected MANY_SEP9<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * Convenience method, same as MANY but the repetition is of one or more.
     * failing to match at least one repetition will result in a parsing error and
     * cause a parsing error.
     *
     * @see MANY
     *
     * @param actionORMethodDef  - The grammar action to optionally invoke multiple times
     *                             or an "OPTIONS" object describing the grammar action and optional properties.
     *
     * @return {OUT[]}
     */
    protected AT_LEAST_ONE<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     */
    protected AT_LEAST_ONE1<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     */
    protected AT_LEAST_ONE2<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     */
    protected AT_LEAST_ONE3<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     */
    protected AT_LEAST_ONE4<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     */
    protected AT_LEAST_ONE5<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     */
    protected AT_LEAST_ONE6<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     */
    protected AT_LEAST_ONE7<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     */
    protected AT_LEAST_ONE8<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     */
    protected AT_LEAST_ONE9<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * Convenience method, same as MANY_SEP but the repetition is of one or more.
     * failing to match at least one repetition will result in a parsing error and
     * cause the parser to attempt error recovery.
     *
     * Note that an additional optional property ERR_MSG can be used to provide custom error messages.
     *
     * @see MANY_SEP
     *
     * @param options - An object defining the grammar of each iteration and the separator between iterations
     *
     * @return {ISeparatedIterationResult<OUT>}
     */
    protected AT_LEAST_ONE_SEP<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     */
    protected AT_LEAST_ONE_SEP1<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     */
    protected AT_LEAST_ONE_SEP2<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     */
    protected AT_LEAST_ONE_SEP3<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     */
    protected AT_LEAST_ONE_SEP4<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     */
    protected AT_LEAST_ONE_SEP5<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     */
    protected AT_LEAST_ONE_SEP6<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     */
    protected AT_LEAST_ONE_SEP7<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     */
    protected AT_LEAST_ONE_SEP8<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     */
    protected AT_LEAST_ONE_SEP9<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     *
     * @param name - The name of the rule.
     * @param implementation - The implementation of the rule.
     * @param [config] - The rule's optional configuration.
     *
     * @returns - The parsing rule which is the production implementation wrapped with the parsing logic that handles
     *                     Parser state / error recovery&reporting/ ...
     */
    protected RULE<T>(
        name: string,
        implementation: (...implArgs: any[]) => T,
        config?: IRuleConfig<T>
    ): (idxInCallingRule?: number, ...args: any[]) => T | any
    /**
     * @See RULE
     * Same as RULE, but should only be used in "extending" grammars to override rules/productions
     * from the super grammar.
     */
    protected OVERRIDE_RULE<T>(
        name: string,
        impl: (...implArgs: any[]) => T,
        config?: IRuleConfig<T>
    ): (idxInCallingRule?: number, ...args: any[]) => T
    protected ruleInvocationStateUpdate(
        shortName: string,
        fullName: string,
        idxInCallingRule: number
    ): void
    protected ruleFinallyStateUpdate(): void
    protected nestedRuleInvocationStateUpdate(
        nestedRuleName: string,
        shortNameKey: number
    ): void
    protected nestedRuleFinallyStateUpdate(): void
    /**
     * Returns an "imaginary" Token to insert when Single Token Insertion is done
     * Override this if you require special behavior in your grammar.
     * For example if an IntegerToken is required provide one with the image '0' so it would be valid syntactically.
     */
    protected getTokenToInsert(tokType: TokenType): IToken
    /**
     * By default all tokens type may be inserted. This behavior may be overridden in inheriting Recognizers
     * for example: One may decide that only punctuation tokens may be inserted automatically as they have no additional
     * semantic value. (A mandatory semicolon has no additional semantic meaning, but an Integer may have additional meaning
     * depending on its int value and context (Inserting an integer 0 in cardinality: "[1..]" will cause semantic issues
     * as the max of the cardinality will be greater than the min value (and this is a false error!).
     */
    protected canTokenTypeBeInsertedInRecovery(tokType: TokenType): boolean
    protected getCurrentGrammarPath(
        tokType: TokenType,
        tokIdxInRule: number
    ): ITokenGrammarPath
    protected getNextPossibleTokenTypes(
        grammarPath: ITokenGrammarPath
    ): TokenType[]
    protected subruleInternal<T>(
        ruleToCall: (idx: number) => T,
        idx: number,
        options?: SubruleMethodOpts
    ): any
    /**
     * @param tokType - The Type of Token we wish to consume (Reference to its constructor function).
     * @param idx - Occurrence index of consumed token in the invoking parser rule text
     *         for example:
     *         IDENT (DOT IDENT)*
     *         the first ident will have idx 1 and the second one idx 2
     *         * note that for the second ident the idx is always 2 even if its invoked 30 times in the same rule
     *           the idx is about the position in grammar (source code) and has nothing to do with a specific invocation
     *           details.
     * @param options -
     *
     * @returns {Token} - The consumed Token.
     */
    protected consumeInternal(
        tokType: TokenType,
        idx: number,
        options: ConsumeMethodOpts
    ): IToken
    input: IToken[]
    protected SKIP_TOKEN(): IToken
    protected LA(howMuch: number): IToken
    protected consumeToken(): void
    protected exportLexerState(): number
    protected resetLexerState(): void
    protected moveToTerminatedState(): void
    protected lookAheadBuilderForOptional(
        alt: lookAheadSequence,
        tokenMatcher: TokenMatcher,
        dynamicTokensEnabled: boolean
    ): () => boolean
    protected lookAheadBuilderForAlternatives(
        alts: lookAheadSequence[],
        hasPredicates: boolean,
        tokenMatcher: TokenMatcher,
        dynamicTokensEnabled: boolean
    ): (orAlts?: IAnyOrAlt<any>[]) => number | undefined
}

export declare type CstElement = IToken | CstNode
export declare type CstChildrenDictionary = {
    [identifier: string]: CstElement[]
}
/**
 * A Concrete Syntax Tree Node.
 * This structure represents the whole parse tree of the grammar
 * This means that information on each and every Token is present.
 * This is unlike an AST (Abstract Syntax Tree) where some of the syntactic information is missing.
 *
 * For example given an ECMAScript grammar, an AST would normally not contain information on the location
 * of Commas, Semi colons, redundant parenthesis ect, however a CST would have that information.
 */
export interface CstNode {
    readonly name: string
    readonly children: CstChildrenDictionary
    readonly recoveredNode?: boolean
    /**
     * Only for "in-lined" rules, the name of the top level rule containing this nested rule
     */
    readonly fullName?: string
}
export interface ICstVisitor<IN, OUT> {
    visit(cstNode: CstNode | CstNode[], param?: IN): OUT
    validateVisitor(): void
}
export interface CstVisitorConstructor extends Function {
    new <IN, OUT>(...args: any[]): ICstVisitor<IN, OUT>
}

export interface IParserErrorMessageProvider {
    /**
     * Mismatched Token Error happens when the parser attempted to consume a terminal and failed.
     * It corresponds to a failed "CONSUME(expected)" in Chevrotain DSL terms.
     *
     * @param options.expected - The expected Token Type.
     *
     * @param options.actual - The actual Token "instance".
     *
     * @param options.ruleName - The rule in which the error occurred.
     */
    buildMismatchTokenMessage?(options: {
        expected: TokenType
        actual: IToken
        ruleName: string
    }): string
    /**
     * A Redundant Input Error happens when the parser has completed parsing but there
     * is still unprocessed input remaining.
     *
     * @param options.firstRedundant - The first unprocessed token "instance".
     *
     * @param options.ruleName - The rule in which the error occurred.
     */
    buildNotAllInputParsedMessage?(options: {
        firstRedundant: IToken
        ruleName: string
    }): string
    /**
     * A No Viable Alternative Error happens when the parser cannot detect any valid alternative in an alternation.
     * It corresponds to a failed "OR" in Chevrotain DSL terms.
     *
     * @param options.expectedPathsPerAlt - First level of the array represents each alternative
     *                           The next two levels represent valid (expected) paths in each alternative.
     *
     * @param options.actual - The actual sequence of tokens encountered.
     *
     * @param options.customUserDescription - A user may provide custom error message descriptor in the "OR" DSL method.
     *                                https://sap.github.io/chevrotain/documentation/3_1_0/interfaces/ormethodopts.html#err_msg
     *                                This is that custom message.
     *
     * @param options.ruleName - The rule in which the error occurred.
     */
    buildNoViableAltMessage?(options: {
        expectedPathsPerAlt: TokenType[][][]
        actual: IToken[]
        customUserDescription: string
        ruleName: string
    }): string
    /**
     * An Early Exit Error happens when the parser cannot detect the first mandatory iteration of a repetition.
     * It corresponds to a failed "AT_LEAST_ONE[_SEP]" in Chevrotain DSL terms.
     *
     * @param options.expectedIterationPaths - The valid (expected) paths in the first iteration.
     *
     * @param options.actual - The actual sequence of tokens encountered.
     *
     * @param options.previous - The previous token parsed.
     *                                This is useful if options.actual[0] is of type chevrotain.EOF and you need to know the last token parsed.
     *
     * @param options.customUserDescription - A user may provide custom error message descriptor in the "AT_LEAST_ONE" DSL method.
     *                                https://sap.github.io/chevrotain/documentation/3_1_0/interfaces/dslmethodoptswitherr.html#err_msg
     *                                This is that custom message.
     *
     * @param options.ruleName - The rule in which the error occurred.
     */
    buildEarlyExitMessage?(options: {
        expectedIterationPaths: TokenType[][]
        actual: IToken[]
        previous: IToken
        customUserDescription: string
        ruleName: string
    }): string
}
/**
 * This is the default logic Chevrotain uses to construct error messages.
 * When constructing a custom error message provider it may be used as a reference
 * or reused.
 */
export declare const defaultParserErrorProvider: IParserErrorMessageProvider
export interface IGrammarResolverErrorMessageProvider {
    buildRuleNotFoundError(
        topLevelRule: Rule,
        undefinedRule: NonTerminal
    ): string
}
export declare const defaultGrammarResolverErrorProvider: IGrammarResolverErrorMessageProvider
export interface IGrammarValidatorErrorMessageProvider {
    buildDuplicateFoundError(
        topLevelRule: Rule,
        duplicateProds: IProductionWithOccurrence[]
    ): string
    buildInvalidNestedRuleNameError(
        topLevelRule: Rule,
        nestedProd: IOptionallyNamedProduction
    ): string
    buildDuplicateNestedRuleNameError(
        topLevelRule: Rule,
        nestedProd: IOptionallyNamedProduction[]
    ): string
    buildNamespaceConflictError(topLevelRule: Rule): string
    buildAlternationPrefixAmbiguityError(options: {
        topLevelRule: Rule
        prefixPath: TokenType[]
        ambiguityIndices: number[]
        alternation: Alternation
    }): string
    buildAlternationAmbiguityError(options: {
        topLevelRule: Rule
        prefixPath: TokenType[]
        ambiguityIndices: number[]
        alternation: Alternation
    }): string
    buildEmptyRepetitionError(options: {
        topLevelRule: Rule
        repetition: IProductionWithOccurrence
    }): string
    buildTokenNameError(options: {
        tokenType: TokenType
        expectedPattern: RegExp
    }): any
    buildEmptyAlternationError(options: {
        topLevelRule: Rule
        alternation: Alternation
        emptyChoiceIdx: number
    }): any
    buildTooManyAlternativesError(options: {
        topLevelRule: Rule
        alternation: Alternation
    }): string
    buildLeftRecursionError(options: {
        topLevelRule: Rule
        leftRecursionPath: Rule[]
    }): string
    buildInvalidRuleNameError(options: {
        topLevelRule: Rule
        expectedPattern: RegExp
    }): string
    buildDuplicateRuleNameError(options: {
        topLevelRule: Rule | string
        grammarName: string
    }): string
}
export declare const defaultGrammarValidatorErrorProvider: IGrammarValidatorErrorMessageProvider

export interface IRecognizerContext {
    /**
     * A copy of the parser's rule stack at the "time" the RecognitionException occurred.
     * This can be used to help debug parsing errors (How did we get here?).
     */
    ruleStack: string[]
    /**
     * A copy of the parser's rule occurrence stack at the "time" the RecognitionException occurred.
     * This can be used to help debug parsing errors (How did we get here?).
     */
    ruleOccurrenceStack: number[]
}
export interface IRecognitionException {
    name: string
    message: string
    /**
     * The token which caused the parser error.
     */
    token: IToken
    /**
     * Additional tokens which have been re-synced in error recovery due to the original error.
     * This information can be used the calculate the whole text area which has been skipped due to an error.
     * For example for displaying with a red underline in a text editor.
     */
    resyncedTokens: IToken[]
    context: IRecognizerContext
}
export declare function isRecognitionException(error: Error): boolean
export declare function MismatchedTokenException(
    message: string,
    token: IToken
): void
export declare function NoViableAltException(
    message: string,
    token: IToken
): void
export declare function NotAllInputParsedException(
    message: string,
    token: IToken
): void
export declare function EarlyExitException(
    message: string,
    token: IToken,
    previousToken: IToken
): void

/**
 * this interfaces defines the path the parser "took" to reach a certain position
 * in the grammar.
 */
export interface IGrammarPath {
    /**
     * The Grammar rules invoked and still unterminated to reach this Grammar Path.
     */
    ruleStack: string[]
    /**
     * The occurrence index (SUBRULE1/2/3/5/...) of each Grammar rule invoked and still unterminated.
     * Used to distinguish between two invocations of the same subrule at the same top level rule.
     * Example: (QualifiedName: SUBRULE1(Identifier) (DOT SUBRULE2(Identifier))*
     */
    occurrenceStack: number[]
}
export interface ITokenGrammarPath extends IGrammarPath {
    lastTok: TokenType
    lastTokOccurrence: number
}
export interface ISyntacticContentAssistPath extends IGrammarPath {
    nextTokenType: TokenType
    nextTokenOccurrence: number
}
export interface IRuleGrammarPath extends IGrammarPath {
    occurrence: number
}

export interface IGASTVisitor {
    visit(prod: IProduction): any
}
export interface IOptionallyNamedProduction {
    name?: string
}
export interface IProduction {
    accept(visitor: IGASTVisitor): void
}
export interface IProductionWithOccurrence extends IProduction {
    idx: number
}
export abstract class AbstractProduction implements IProduction {
    definition: IProduction[]
    constructor(definition: IProduction[])
    accept(visitor: IGASTVisitor): void
}
export declare class NonTerminal extends AbstractProduction
    implements IProductionWithOccurrence {
    nonTerminalName: string
    referencedRule: Rule
    idx: number
    constructor(options: {
        nonTerminalName: string
        referencedRule?: Rule
        idx?: number
    })
    definition: IProduction[]
    accept(visitor: IGASTVisitor): void
}
export declare class Rule extends AbstractProduction {
    name: string
    orgText: string
    constructor(options: {
        name: string
        definition: IProduction[]
        orgText?: string
    })
}
export declare class Flat extends AbstractProduction
    implements IOptionallyNamedProduction {
    name: string
    constructor(options: { definition: IProduction[]; name?: string })
}
export declare class Option extends AbstractProduction
    implements IProductionWithOccurrence, IOptionallyNamedProduction {
    idx: number
    name?: string
    constructor(options: {
        definition: IProduction[]
        idx?: number
        name?: string
    })
}
export declare class RepetitionMandatory extends AbstractProduction
    implements IProductionWithOccurrence, IOptionallyNamedProduction {
    name: string
    idx: number
    constructor(options: {
        definition: IProduction[]
        idx?: number
        name?: string
    })
}
export declare class RepetitionMandatoryWithSeparator extends AbstractProduction
    implements IProductionWithOccurrence, IOptionallyNamedProduction {
    separator: TokenType
    idx: number
    name: string
    constructor(options: {
        definition: IProduction[]
        separator: TokenType
        idx?: number
        name?: string
    })
}
export declare class Repetition extends AbstractProduction
    implements IProductionWithOccurrence, IOptionallyNamedProduction {
    separator: TokenType
    idx: number
    name: string
    constructor(options: {
        definition: IProduction[]
        idx?: number
        name?: string
    })
}
export declare class RepetitionWithSeparator extends AbstractProduction
    implements IProductionWithOccurrence, IOptionallyNamedProduction {
    separator: TokenType
    idx: number
    name: string
    constructor(options: {
        definition: IProduction[]
        separator: TokenType
        idx?: number
        name?: string
    })
}
export declare class Alternation extends AbstractProduction
    implements IProductionWithOccurrence, IOptionallyNamedProduction {
    idx: number
    name: string
    constructor(options: {
        definition: IProduction[]
        idx?: number
        name?: string
    })
}
export declare class Terminal implements IProductionWithOccurrence {
    terminalType: TokenType
    idx: number
    constructor(options: { terminalType: TokenType; idx?: number })
    accept(visitor: IGASTVisitor): void
}
export interface ISerializedGast {
    type:
        | "NonTerminal"
        | "Flat"
        | "Option"
        | "RepetitionMandatory"
        | "RepetitionMandatoryWithSeparator"
        | "Repetition"
        | "RepetitionWithSeparator"
        | "Alternation"
        | "Terminal"
        | "Rule"
    definition?: ISerializedGast[]
}
export interface ISerializedGastRule extends ISerializedGast {
    name: string
}
export interface ISerializedNonTerminal extends ISerializedGast {
    name: string
    idx: number
}
export interface ISerializedTerminal extends ISerializedGast {
    name: string
    label?: string
    pattern?: string
    idx: number
}
export interface ISerializedTerminalWithSeparator extends ISerializedGast {
    separator: ISerializedTerminal
}
export declare function serializeGrammar(topRules: Rule[]): ISerializedGast[]
export declare function serializeProduction(node: IProduction): ISerializedGast

export declare function resolveGrammar(options: {
    rules: Rule[]
    errMsgProvider?: IGrammarResolverErrorMessageProvider
}): IParserDefinitionError[]
export declare function validateGrammar(options: {
    rules: Rule[]
    maxLookahead: number
    tokenTypes: TokenType[]
    grammarName: string
    errMsgProvider: IGrammarValidatorErrorMessageProvider
    ignoredIssues?: IgnoredParserIssues
}): IParserDefinitionError[]
export declare function assignOccurrenceIndices(options: {
    rules: Rule[]
}): void

/**
 * Clears the chevrotain internal cache.
 * This should not be used in regular work flows, This is intended for
 * unique use cases for example: online playground where the a parser with the same name is initialized with
 * different implementations multiple times.
 */
export declare function clearCache(): void

export declare function createSyntaxDiagramsCode(
    grammar: ISerializedGast[],
    {
        resourceBase,
        css
    }?: {
        /**
         * Base Url to load the runtime resources for rendering the diagrams
         */
        resourceBase?: string
        /**
         * Url to load the styleSheet, replace with your own for styling customization.
         */
        css?: string
    }
): string
