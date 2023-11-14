import { UseGuards,Controller, Get, Param } from '@nestjs/common';
import {GameService} from './game.service';
import { GameEntity } from 'src/typeorm/game.entity';
import { AuthenticatedGuard } from 'src/auth/oauth/oauth.guard';

@Controller('game')
export class GameController {
    constructor( private gameService: GameService ) {}

@UseGuards(AuthenticatedGuard)
    @Get('/:intraId')
    async getGamesByPlayerId(@Param('intraId') intraId: string): Promise<GameEntity[]> {
        return this.gameService.getGamesByPlayerId(intraId);
    }
}
