import CartInstrumento from "../types/CartInstrumento";
import Instrumento from "../types/Instrumento";
import  BackendClient  from "./BackendClient";


export default class InstrumentoService extends BackendClient<Instrumento | CartInstrumento> {}