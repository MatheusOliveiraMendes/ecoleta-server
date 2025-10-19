import { Knex } from 'knex';

export async function seed(knex: Knex) {
    await knex('items').del();
    await knex('items').insert([
        { title: 'Lamps', image: 'lamps.svg' },
        { title: 'Batteries', image: 'batteries.svg' },
        { title: 'Paper and Cardboard', image: 'paper-cardboard.svg' },
        { title: 'Electronic Waste', image: 'electronics.svg' },
        { title: 'Organic Waste', image: 'organic.svg' },
        { title: 'Cooking Oil', image: 'cooking-oil.svg' },
    ]);
}
