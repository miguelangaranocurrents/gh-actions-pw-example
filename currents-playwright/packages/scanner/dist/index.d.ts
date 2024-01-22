import * as _currents_pwc_parser from '@currents/pwc-parser';

declare const pwcScanner: (params: {
    project?: string;
    grep: string | null;
    grepInvert: string | null;
    config?: string;
}) => Promise<{
    execaResult: any;
    result: null;
} | {
    execaResult: any;
    result: _currents_pwc_parser.TestSuite;
}>;

export { pwcScanner };
