import { HubConnectionBuilder } from "@microsoft/signalr";

class Printer {
    conn = null;
    initialized = false;

    constructor(connection) {
        this.conn = connection;

        this.conn.on("Disconnect", function () {
            this.initialized = false;
        });

        this.conn.on("Shutdown", function () {
            this.initialized = false;
        });
    }

    async Init() {
        if (this.initialized) {
            if (this.conn.state.toUpperCase() == "CONNECTED") throw new Error('La impresora ya se encuentra inicializada');
            this.initialized = false;
        }

        try {
            await this.conn.start();
        } catch (err) {
            this.initialized = false;
            throw new Error('No se pudo inicializar la impresora. Posiblemente el servicio no este activo en el puerto ingresado. Trace: ' + err);
        }

        let status = await this.conn.invoke("GetStatus");
        if (status != "OK") {
            await this.conn.stop();
            throw new Error('No se pudo inicializar la impresora. Estado: ' + status);
        }

        await this.conn.send("Clear");
        this.initialized = true;
    }

    async Finish() {
        if (!this.initialized || this.conn.state.toUpperCase() == "DISCONNECTED") {
            this.initialized = false;
            throw new Error('La impresora ya se encuentra finalizada');
        }

        try {
            await this.conn.send("Clear");
            await this.conn.stop();
        } catch (err) {
            this.initialized = false;
            throw new Error('Se presentó un error al finalizar la impresora. Trace: ' + err);
        }
    }

    async GetStatus() {
        return await this.conn.invoke("GetStatus");
    }

    DisableChineseCharacters() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("DisableChineseCharacters");
    }

    AddText(text) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("AddText", text);
    }

    AddTextLine(text) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("AddTextLine", text);
    }

    NewLine() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("NewLine");
    }

    NewLines(Lines) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("NewLines", Lines);
    }

    AddTextBold(text) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("AddTextBold", text);
    }

    TextBoldOn() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("TextBoldOn");
    }

    TextBoldOff() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("TextBoldOff");
    }

    AddTextUnderline(text) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("AddTextUnderline", text);
    }

    TextUnderlineOn() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("TextUnderlineOn");
    }

    TextUnderlineOff() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("TextUnderlineOff");
    }

    AlignLeft() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("AlignLeft");
    }

    AlignCenter() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("AlignCenter");
    }

    AlignRight() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("AlignRight");
    }

    ExpandedModeOn() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("ExpandedModeOn");
    }

    ExpandedModeOff() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("ExpandedModeOff");
    }

    CondensedModeOn() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("CondensedModeOn");
    }

    CondensedModeOff() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("CondensedModeOff");
    }

    FontNormalSize() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("FontNormalSize");
    }

    FontCustomSize(width = 1, heigth = 1) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("FontCustomSize", width, heigth);
    }

    NormalWidth() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("NormalWidth");
    }

    DoubleWidth2() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("DoubleWidth2");
    }

    DoubleWidth3() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("DoubleWidth3");
    }

    Logo() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("Logo");
    }

    async Image(url) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        await this.conn.send("Image", url);
    }

    Code39(code) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("Code39", code);
    }

    Code128(code) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("Code128", code);
    }

    QRUrl(url, size = 5) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("QRUrl", url, size);
    }

    QRText(text, size = 8) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("QRText", text, size);
    }

    Cut() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("Cut");
    }

    OpenDrawer() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("OpenDrawer");
    }

    async Print() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');

        let result = await this.conn.invoke("Print");
        if (result != "OK") throw new Error('No se pudo imprimir. Trace: ' + result);
    }

    Clear() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("Clear");
    }
}

export const CreatePrinter = (port = 1412) => {
    if (!Number.isInteger(port)) throw new Error('El puerto debe ser un entero');
    if (port < 1 || port > 65535) throw new Error('El puerto debe estar entre 1 y 65535');
    let connection = new HubConnectionBuilder().withUrl(`http://localhost:${port}/printer`, { withCredentials: false }).build();
    return new Printer(connection);
}
