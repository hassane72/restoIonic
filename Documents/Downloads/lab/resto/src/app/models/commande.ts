import {User} from './user';
import {Plat} from './plat';
import {Menu} from './menu';

export class Commande {
    id: number;
    plats: Array<Plat>;
    menu: Menu;
    user: User;
}
