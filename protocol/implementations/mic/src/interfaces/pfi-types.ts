import {TBDexMessage, RequestForQuote, Quote} from './tbdex-types';


/** 
 * 
 * This is the interface to be implemented by PFIs. 
 */
export type PFI = {
    makeBid(message: TBDexMessage<RequestForQuote>): Quote[];
}
