import { Request, Response } from 'express';
import knex from '../database/connection';
import { resolveAssetsBaseUrl } from '../utils/baseUrl';

class ItemsController {
    async index (req: Request, res: Response) {

        const items = await knex('items').select('*');
    
        const assetsBaseUrl = resolveAssetsBaseUrl(req);

        const serializedItems = items.map(item => ({
            id: item.id,
            title: item.title,
            image_url: `${assetsBaseUrl}/${item.image}`,
        }));
    
        return res.json(serializedItems);
    
    }
}

export default ItemsController;
