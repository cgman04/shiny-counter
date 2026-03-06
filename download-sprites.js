#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POKEMON_COUNT = 1025; // As of Gen 9
const GENS = [
  { num: 1, dir: 'generation-i' },
  { num: 2, dir: 'generation-ii' },
  { num: 3, dir: 'generation-iii' },
  { num: 4, dir: 'generation-iv' },
  { num: 5, dir: 'generation-v' },
  { num: 6, dir: 'generation-vi' },
  { num: 7, dir: 'generation-vii' },
  { num: 8, dir: 'generation-viii' },
  { num: 9, dir: 'generation-ix' },
];

// Fetch pokemon list from PokeAPI
async function getPokemonList() {
  return new Promise((resolve, reject) => {
    https.get('https://pokeapi.co/api/v2/pokemon?limit=1025', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.results.map((p, i) => ({ name: p.name, id: i + 1 })));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Download a file from URL
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => { }); // Delete the file if error
      reject(err);
    });
  });
}

async function downloadSprites() {
  try {
    console.log('Fetching Pokemon list...');
    const pokemonList = await getPokemonList();
    console.log(`Found ${pokemonList.length} Pokemon`);

    for (const gen of GENS) {
      console.log(`\nDownloading Gen ${gen.num} sprites...`);

      for (const pokemon of pokemonList) {
        const normalDir = path.join(__dirname, `public/sprites/gen${gen.num}/normal`);
        const shinyDir = path.join(__dirname, `public/sprites/gen${gen.num}/shiny`);

        fs.mkdirSync(normalDir, { recursive: true });
        fs.mkdirSync(shinyDir, { recursive: true });

        const normalUrl = `https://img.pokemondb.net/sprites/${gen.dir}/${pokemon.name}.png`;
        const shinyUrl = `https://img.pokemondb.net/sprites/${gen.dir}/shiny/${pokemon.name}.png`;

        const normalPath = path.join(normalDir, `${pokemon.name}.png`);
        const shinyPath = path.join(shinyDir, `${pokemon.name}.png`);

        try {
          if (!fs.existsSync(normalPath)) {
            await downloadFile(normalUrl, normalPath);
          }
          if (!fs.existsSync(shinyPath)) {
            await downloadFile(shinyUrl, shinyPath);
          }
          process.stdout.write(`\r  Downloaded: ${pokemon.id}/${pokemonList.length}`);
        } catch (err) {
          console.error(`\n  Error downloading ${pokemon.name}: ${err.message}`);
        }
      }
      console.log(' ✓');
    }

    console.log('\n✅ All sprites downloaded successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

downloadSprites();
