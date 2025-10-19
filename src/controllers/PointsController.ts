import { Request, Response } from 'express';
import knex from '../database/connection';
import { resolveBaseUrl } from '../utils/baseUrl';

class PointsController {

    async index(req: Request, res: Response) {
        const { city, state, items } = req.query;

        const parsedItems = items
            ? String(items)
                .split(',')
                .map(item => Number(item.trim()))
                .filter(item => !Number.isNaN(item))
            : [];

        const pointsQuery = knex('points').distinct().select('points.*');

        if (parsedItems.length > 0) {
            pointsQuery
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parsedItems);
        }

        if (city) {
            pointsQuery.where('city', String(city));
        }

        if (state) {
            pointsQuery.where('state', String(state));
        }

        const points = await pointsQuery;
        const baseUrl = resolveBaseUrl(req);

        const serializedPoints = points.map(point => ({
            ...point,
            image_url: `${baseUrl}/uploads/${point.image}`,
        }));

        return res.json(serializedPoints);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();
        if (!point) {
            return res.status(404).json({ message: 'Point not found.' });
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        const baseUrl = resolveBaseUrl(req);
        const serializedPoint = {
            ...point,
            image_url: `${baseUrl}/uploads/${point.image}`,
        };

        return res.json({ point: serializedPoint, items });
    }


    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            state,
            items
        } = req.body;

        const parsedItems: number[] = Array.isArray(items)
            ? items
                .map(item => Number(item))
                .filter(item => !Number.isNaN(item))
            : typeof items === 'string'
                ? items
                    .split(',')
                    .map(item => Number(item.trim()))
                    .filter(item => !Number.isNaN(item))
                : typeof items === 'number'
                    ? [items]
                    : [];

        const trx = await knex.transaction();

        try {
            const point = {
                image: 'image-fake',
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                state
            };

            const insertedIds = await trx('points').insert(point);

            const point_id = insertedIds[0];

            const pointItems = parsedItems.map(item_id => ({
                item_id,
                point_id,
            }));

            if (pointItems.length > 0) {
                await trx('point_items').insert(pointItems);
            }

            await trx.commit();

            return res.status(201).json({
                id: point_id,
                ...point,
            });
        } catch (error) {
            await trx.rollback();
            return res.status(500).json({ message: 'Unexpected error while creating point.' });
        }

    }
}

export default PointsController;
