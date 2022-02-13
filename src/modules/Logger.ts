export default class Logger {

    constructor(prefix?: string) {

    }

    info(msg: string) {
        console.log(`[INFO] ${msg}`)
    }
    log(msg: string) {
        console.log(`[LOG] ${msg}`)
    }

    error(msg: string) {
        console.log(`[ERROR] ${msg}`)
    }

    warn(msg: string) {
        console.log(`[WARN] ${msg}`)
    }

}