import {
    AtLeastOneSepMethodOpts,
    ConsumeMethodOpts,
    DSLMethodOpts,
    DSLMethodOptsWithErr,
    GrammarAction,
    HashTable,
    IAnyOrAlt,
    ICstVisitor,
    IParserConfig,
    IRecognitionException,
    ISeparatedIterationResult,
    ISerializedGast,
    ISyntacticContentAssistPath,
    ITokenGrammarPath,
    ManySepMethodOpts,
    OrMethodOpts,
    Rule,
    SubruleMethodOpts
} from "./chevrotain"

export declare const VERSION: string

export declare class Parser {
    /**
     * This must be called at the end of a Parser constructor.
     * See: http://sap.github.io/chevrotain/docs/tutorial/step2_parsing.html#under-the-hood
     */
    protected static performSelfAnalysis(parserInstance: Parser): void

    /**
     * It is recommanded to reuse the same Parser instance
     * by passing an empty array to the input argument
     * and only later setting the input by using the input property.
     * See: http://sap.github.io/chevrotain/docs/FAQ.html#major-performance-benefits
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
     * @hidden
     */
    protected CONSUME1(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     * @hidden
     */
    protected CONSUME2(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     * @hidden
     */
    protected CONSUME3(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     * @hidden
     */
    protected CONSUME4(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     * @hidden
     */
    protected CONSUME5(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     * @hidden
     */
    protected CONSUME6(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     * @hidden
     */
    protected CONSUME7(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     * @hidden
     */
    protected CONSUME8(tokType: TokenType, options?: ConsumeMethodOpts): IToken
    /**
     * @see CONSUME
     * @hidden
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
     * @hidden
     */
    protected SUBRULE1<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     * @hidden
     */
    protected SUBRULE2<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     * @hidden
     */
    protected SUBRULE3<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     * @hidden
     */
    protected SUBRULE4<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     * @hidden
     */
    protected SUBRULE5<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     * @hidden
     */
    protected SUBRULE6<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     * @hidden
     */
    protected SUBRULE7<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     * @hidden
     */
    protected SUBRULE8<T>(
        ruleToCall: (idx: number) => T,
        options?: SubruleMethodOpts
    ): T
    /**
     * @see SUBRULE
     * @hidden
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
     * @hidden
     */
    protected OPTION1<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     * @hidden
     */
    protected OPTION2<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     * @hidden
     */
    protected OPTION3<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     * @hidden
     */
    protected OPTION4<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     * @hidden
     */
    protected OPTION5<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     * @hidden
     */
    protected OPTION6<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     * @hidden
     */
    protected OPTION7<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     * @hidden
     */
    protected OPTION8<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT
    /**
     * @see OPTION
     * @hidden
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
     * @hidden
     */
    protected OR1<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     * @hidden
     */
    protected OR2<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     * @hidden
     */
    protected OR3<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     * @hidden
     */
    protected OR4<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     * @hidden
     */
    protected OR5<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     * @hidden
     */
    protected OR6<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     * @hidden
     */
    protected OR7<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     * @hidden
     */
    protected OR8<T>(altsOrOpts: IAnyOrAlt<T>[] | OrMethodOpts<T>): T
    /**
     * @see OR
     * @hidden
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
     * @hidden
     */
    protected MANY1<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     * @hidden
     */
    protected MANY2<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     * @hidden
     */
    protected MANY3<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     * @hidden
     */
    protected MANY4<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     * @hidden
     */
    protected MANY5<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     * @hidden
     */
    protected MANY6<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     * @hidden
     */
    protected MANY7<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     * @hidden
     */
    protected MANY8<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOpts<OUT>
    ): OUT[]
    /**
     * @see MANY
     * @hidden
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
     * @hidden
     */
    protected MANY_SEP1<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     * @hidden
     */
    protected MANY_SEP2<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     * @hidden
     */
    protected MANY_SEP3<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     * @hidden
     */
    protected MANY_SEP4<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     * @hidden
     */
    protected MANY_SEP5<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     * @hidden
     */
    protected MANY_SEP6<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     * @hidden
     */
    protected MANY_SEP7<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     * @hidden
     */
    protected MANY_SEP8<OUT>(
        options: ManySepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see MANY_SEP
     * @hidden
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
     * @hidden
     */
    protected AT_LEAST_ONE1<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     * @hidden
     */
    protected AT_LEAST_ONE2<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     * @hidden
     */
    protected AT_LEAST_ONE3<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     * @hidden
     */
    protected AT_LEAST_ONE4<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     * @hidden
     */
    protected AT_LEAST_ONE5<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     * @hidden
     */
    protected AT_LEAST_ONE6<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     * @hidden
     */
    protected AT_LEAST_ONE7<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     * @hidden
     */
    protected AT_LEAST_ONE8<OUT>(
        actionORMethodDef: GrammarAction<OUT> | DSLMethodOptsWithErr<OUT>
    ): OUT[]
    /**
     * @see AT_LEAST_ONE
     * @hidden
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
     * @hidden
     */
    protected AT_LEAST_ONE_SEP1<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     * @hidden
     */
    protected AT_LEAST_ONE_SEP2<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     * @hidden
     */
    protected AT_LEAST_ONE_SEP3<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     * @hidden
     */
    protected AT_LEAST_ONE_SEP4<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     * @hidden
     */
    protected AT_LEAST_ONE_SEP5<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     * @hidden
     */
    protected AT_LEAST_ONE_SEP6<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     * @hidden
     */
    protected AT_LEAST_ONE_SEP7<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     * @hidden
     */
    protected AT_LEAST_ONE_SEP8<OUT>(
        options: AtLeastOneSepMethodOpts<OUT>
    ): ISeparatedIterationResult<OUT>
    /**
     * @see AT_LEAST_ONE_SEP
     * @hidden
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

    protected getNextPossibleTokenTypes(
        grammarPath: ITokenGrammarPath
    ): TokenType[]

    input: IToken[]
    protected SKIP_TOKEN(): IToken
    protected LA(howMuch: number): IToken
}

/**
 * Creates a new Chevrotain TokenType which can then be used
 * to define a Chevrotain Lexer and Parser
 *
 * @returns {TokenType}
 */
export declare function createToken(config: {
    name: string
    /**
     * Categories enable polymorphism on Token Types.
     * A TokenType X with categories C1, C2, ... ,Cn can
     * be matched by the parser against any of those categories.
     * In practical terms this means that:
     * CONSUME(C1) can match a Token of type X.
     */
    categories?: TokenType | TokenType[]
    /**
     * The Label is a human readable name to be used
     * in error messages and syntax diagrams.
     *
     * For example a TokenType may be called LCurly, which is
     * short for "left curly brace". The much easier to understand
     * label could simply be "{".
     */
    label?: string
    /**
     * This defines what sequence of characters would be matched
     * To this TokenType when Lexing.
     *
     * For CustomPatterns see: http://sap.github.io/chevrotain/docs/guide/custom_token_patterns.html
     */
    pattern?: RegExp | string | CustomPatternMatcherFunc | ICustomPattern
    /**
     * The group property will cause the lexer to collect
     * Tokens of this type separately from the other Tokens.
     *
     * For example this could be used to collect comments for
     * post processing.
     *
     * See: https://github.com/SAP/chevrotain/tree/master/examples/lexer/token_groups
     */
    group?: string

    /**
     * A name of a Lexer mode to "enter" once this Token Type has been matched.
     * Lexer modes can be used to support different sets of possible Tokens Types
     *
     * Lexer Modes work as a stack of Lexers, so "entering" a mode means pushing it to the top of the stack.
     *
     * See: https://github.com/SAP/chevrotain/tree/master/examples/lexer/multi_mode_lexer
     */
    push_mode?: string

    /**
     * If "pop_mode" is true the Lexer will pop the last mode of the modes stack and
     * continue lexing using the new mode at the top of the stack.
     *
     * See: https://github.com/SAP/chevrotain/tree/master/examples/lexer/multi_mode_lexer
     */
    pop_mode?: boolean

    /**
     * The "longer_alt" property will cause the Lexer to attempt matching against another Token Type
     * every time this Token Type has been matched.
     *
     * This feature can be useful when two Token Types have common prefixes which
     * cannot be resolved (only) by the ordering of the Tokens in the lexer definition.
     *
     * For example see: https://github.com/SAP/chevrotain/tree/master/examples/lexer/keywords_vs_identifiers
     * For resolving the keywords vs Identifier ambiguity.
     */
    longer_alt?: TokenType

    /**
     * Can a String matching this Token Type's pattern possibly contain a line terminator?
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

/**
 *  API #1 for custom token patterns.
 *  See full guide at: http://sap.github.io/chevrotain/docs/guide/custom_token_patterns.html
 */
export declare type CustomPatternMatcherFunc = (
    /**
     * The full input string.
     */
    test: string,
    /**
     * The offset at which to attempt a match
     */
    offset: number,
    /**
     * Previously scanned Tokens
     */
    tokens?: IToken[],
    /**
     * Previously scanned Groups
     */
    groups?: {
        [groupName: string]: IToken
    }
) => RegExpExecArray

/**
 *  API #2 for custom token patterns.
 *  See full guide at: http://sap.github.io/chevrotain/docs/guide/custom_token_patterns.html
 */
interface ICustomPattern {
    exec: CustomPatternMatcherFunc
}

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

export declare function tokenName(tokType: TokenType): string

/**
 *  Returns a human readable label for a TokenType if it exists
 *  The TokenType name otherwise.
 *
 *  Labels are useful in improving the readability of error messages and syntax diagrams.
 *  To define labels provide the label property in the {@link createToken} config argument.
 */
export declare function tokenLabel(tokType: TokenType): string

export declare type MultiModesDefinition = {
    [modeName: string]: TokenType[]
}

export interface IMultiModeLexerDefinition {
    modes: MultiModesDefinition
    defaultMode: string
}

export type TokenTypeDictionary = { [tokenName: string]: TokenType }

export declare type TokenVocabulary =
    | TokenTypeDictionary
    | TokenType[]
    | IMultiModeLexerDefinition

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
