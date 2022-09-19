import axios from "axios";
import cheerio from 'cheerio';
import fs from "fs";

const url = "https://rateyourmusic.com/charts/top/album/all-time/deweight:live,archival,soundtrack/2/";

async function scrapeData() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $(".page_section_charts_item_wrapper");
        const albums = [];
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min)*10;
        }
        listItems.each((idx, el) => {
            const album = {
                name: "",
                artist: "",
                image: "",
                date: "",
                genre: "",
                price: Number(getRandomInt(8, 20))
            };
            album.name = $(el).find(".page_charts_section_charts_item_title a span span").text();
            album.artist = $(el).find(".page_charts_section_charts_item_credited_links_primary a span span").text();
            album.image = $(el).find('.page_charts_section_charts_item_image_link').find('img').first().attr('data-src');
            if (!album.image) {
                album.image = $(el).find('.page_charts_section_charts_item_image_link').find('img').first().attr('src');
            }
            album.date = $(el).find('.page_charts_section_charts_item_date span').first().text();
            album.genre = $(el).find('.page_charts_section_charts_item_genres_primary').text();
            albums.push(album);
        })
        fs.writeFile("albums.json", JSON.stringify(albums, null, 2), (err) => {
            if (err) {
                console.error(err);
                return
            }
            console.log("Sucessfully written!");
        })
    } catch (error) {
        console.error(error);
    }
}

scrapeData();


