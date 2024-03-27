const signalR = require("@microsoft/signalr");



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

    QRUrl(url) {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("QRUrl", url);
    }

    Cut() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');
        this.conn.send("Cut");
    }

    async Print() {
        if (!this.initialized) throw new Error('No se ha inicializado la impresora');

        let result = await this.conn.invoke("Print");
        if (result != "OK") throw new Error('No se pudo imprimir. Trace: ' + result);
    }

}

export function Create(port = 1412) {
    if (!Number.isInteger(port)) throw new Error('El puerto debe ser un entero');
    if (port < 1 || port > 65535) throw new Error('El puerto debe estar entre 1 y 65535');
    let connection = new signalR.HubConnectionBuilder().withUrl(`http://localhost:${port}/printer`, { withCredentials: false }).build();
    return new Printer(connection);
}
