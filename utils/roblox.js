const axios = require("axios");
const cache = require("./cache");

async function getThumbnail(assetId) {
const THUMBNAIL_URL =
    "https://thumbnails.roblox.com/v1/assets";

async function getIcon(assetId) {

    if (cache.thumbnails.has(assetId))
        return cache.thumbnails.get(assetId);

    try {

        const response = await axios.get(
            `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`
            `${THUMBNAIL_URL}?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`
        );

        const image = response.data.data?.[0]?.imageUrl ?? null;
        const image =
            response.data.data?.[0]?.imageUrl ?? null;

        cache.thumbnails.set(assetId, image);

        return image;

    } catch (err) {

        console.error(err);

        return null;

    }

}

async function getIcon(assetId) {

    try {

        const response = await axios.get(
            `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`
        );

        return response.data.data?.[0]?.imageUrl ?? null;

    } catch {
        console.error("Thumbnail Error:", err.message);

        return null;

@@ -56,7 +42,9 @@ async function getCollectibleItemId(assetId) {

        return response.data.CollectibleItemId || null;

    } catch {
    } catch (err) {

        console.error("Collectible Error:", err.message);

        return null;

@@ -75,13 +63,19 @@ async function getCheapest(assetId) {
            `https://economy.roblox.com/v1/assets/${assetId}/resellers?limit=10`
        );

        const cheapest = response.data.data?.[0] || null;
        const cheapest = response.data.data?.find(
            reseller =>
                reseller &&
                typeof reseller.price === "number"
        ) || null;

        cache.cheapest.set(assetId, cheapest);

        return cheapest;

    } catch {
    } catch (err) {

        console.error("Reseller Error:", err.message);

        return null;

@@ -90,7 +84,6 @@ async function getCheapest(assetId) {
}

module.exports = {
    getThumbnail,
    getIcon,
    getCollectibleItemId,
    getCheapest
