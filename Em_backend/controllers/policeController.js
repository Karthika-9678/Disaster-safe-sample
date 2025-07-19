const PoliceStation = require('../models/PoliceStation');

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.getNearestPoliceStation = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const stations = await PoliceStation.find();
    let nearest = null;
    let minDist = Number.MAX_VALUE;

    stations.forEach(station => {
      const dist = getDistance(latitude, longitude, station.latitude, station.longitude);
      if (dist < minDist) {
        minDist = dist;
        nearest = station;
      }
    });

    if (!nearest) {
      return res.status(404).json({ error: 'No police stations found' });
    }

    res.json({
      name: nearest.name,
      phone: nearest.phone,
      distance: minDist.toFixed(2) + ' km'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
