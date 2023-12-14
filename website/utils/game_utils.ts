const origin: string = process.env.NEXT_PUBLIC_ORIGIN as string;
const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
const privateApiKey: string = process.env.PRIVATE_GOOGLE_API_KEY as string;

const locations: Promise<{ lat: number, lng: number, address: string }>[] = [];
const max_rounds = 5;
const minimum_backlog = 20;
const build = "0.4.1";

const places = {
    Kongsberg: {
        latMin: 59.6295025,
        latMax: 59.7095025,

        lngMin: 9.6108472,
        lngMax: 9.6908472
    },
    Drammen: {
        latMin: 59.530,
        latMax: 59.862,

        lngMin: 9.94,
        lngMax: 10.42
    }
}

const boundings = places.Kongsberg;

function calculateArea(latMin: number, latMax: number, lngMin: number, lngMax: number) {
    return (latMax - latMin) * (lngMax - lngMin);
}

function getStreetView(lat: number, lng: number) {
    return fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?key=${apiKey}&location=${lat},${lng}`)
        .then(res => res.json());
}

// in stackoverflow we trust
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function calculateScore(round: any) {
    const distance = round.distance;
    const time = round.time_taken;

    //return Math.max(0, 1000 - (distance / 1000) - (time / 1000));
    return Math.max(0, 1000 - distance);
}

async function getGeoData(lat: number, lng: number) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${privateApiKey}&latlng=${lat},${lng}`)
        .then(res => res.json()).then(data => data.results[0]);
}

async function getRandomPlace(): Promise<{ lat: number, lng: number, address: string }> {
    let lat = Math.random() * (boundings.latMax - boundings.latMin) + boundings.latMin;
    let lng = Math.random() * (boundings.lngMax - boundings.lngMin) + boundings.lngMin;

    let data = (await getGeoData(lat, lng));

    const {latMin, lngMin} = data.geometry.viewport.northeast;
    const {latMax, lngMax} = data.geometry.viewport.southwest;
    
    const area = calculateArea(latMin, latMax, lngMin, lngMax);

    if (area > 1E-5) {
        console.log("area too big, retrying", area);
        return await getRandomPlace();
    }

    const streetView = await getStreetView(lat, lng);

    if (!streetView.status || streetView.status !== "OK") {
        //console.log("not a valid street view, retrying");
        return await getRandomPlace();
    }

    return {
        lat: streetView.location.lat,
        lng: streetView.location.lng,
        address: data.formatted_address
    }
}

async function getValidPlace(size: number): Promise<{ lat: number, lng: number, address: string }> {
    if (minimum_backlog > locations.length) {
        const promises = [];

        const placesToAdd = minimum_backlog - locations.length + 10; // add 10 extra to be sure

        for (let i = 0; i < placesToAdd; i++) {
            promises.push(getRandomPlace());
        }

        locations.push(...promises);
    }

    if (locations.length >= size) {
        return locations.shift() as Promise<{ lat: number, lng: number, address: string }>;
    }

    const promises = [];

    for (let i = 0; i < size; i++) {
        promises.push(getRandomPlace());
    }

    locations.push(...promises);

    return await Promise.race(promises);
}

export default { getValidPlace, getRandomPlace, calculateDistance, getGeoData, calculateScore, origin, apiKey, max_rounds, boundings, build };