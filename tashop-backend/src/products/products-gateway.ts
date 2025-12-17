import { Logger } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from 'socket.io'
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
    cors:{
        origin:'*',

    }
})
export class ProductsGateway{
    constructor(private readonly authService:AuthService){}
    private readonly logger = new Logger(ProductsGateway.name);

    @WebSocketServer() // websocket isteği
    private readonly server:Server; //websocket instance oluşrurduk
    handleProductUpdated(){
        this.logger.log("Emitting productUpdated");
        this.server.emit('productUpdated')
    }
    handleConnection(client:Socket){
        try {
          //http deki jwt auth yapısının aynısı
            // Client may send either:
            // - auth: { Authentication: "<jwt>" }
            // - auth: { Authentication: { value: "<jwt>" } }
            const auth = client.handshake.auth as any;
            const token =
              typeof auth?.Authentication === "string"
                ? auth.Authentication
                : typeof auth?.Authentication?.value === "string"
                  ? auth.Authentication.value
                  : undefined;

            if (!token) {
              this.logger.warn(`WS connect unauthorized (missing token) clientId=${client.id}`);
              client.disconnect(true);
              return;
            }

            this.authService.verifyToken(token); //normal guardlar websockette kullanılmadıgı için manuel verify
            this.logger.log(`WS connected AUTH OK clientId=${client.id}`);
        } catch (_error) {
            // IMPORTANT: do not throw here — it can crash the whole Nest process.
            this.logger.warn(`WS connect unauthorized (invalid token) clientId=${client.id}`);
            client.disconnect(true);
            return;
        }
    }

    handleDisconnect(client: Socket) {
      this.logger.log(`WS disconnected clientId=${client.id}`);
    }
}