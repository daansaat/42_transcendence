import {Module} from '@nestjs/common';
import {GameService} from './game.service';
import {GameController} from './game.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GameEntity} from '../typeorm/game.entity';
import {UserEntity} from '../typeorm/user.entity';
import { GatewayModule } from '../gateway/gateway.module';
import { UserModule } from 'src/user/user.module';


@Module({
    imports: [TypeOrmModule.forFeature([GameEntity, UserEntity]), GatewayModule, UserModule],
    providers: [GameService],
    controllers: [GameController],
    exports: [GameService]
})
export class GameModule {}

