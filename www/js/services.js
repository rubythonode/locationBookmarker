angular.module('starter.services', [])

.factory('Locations', function($q) {
  return {
    getAllWithDistances: function() {
      var deferred = $q.defer();

      navigator.geolocation.getCurrentPosition(function(position) {
        locations = _.map(this.getAll(), function(loc){
          loc.distance = this.getDistance(
            {longitude: loc.longitude, latitude: loc.latitude},
            {longitude: position.coords.longitude, latitude: position.coords.latitude}
          )
          return loc
        }.bind(this))
        deferred.resolve(locations)
      }.bind(this))
      return deferred.promise
    },
    getAll: function() {
      locations = localStorage.getItem('__locations')
      locations = locations ? locations : '[]'
      return JSON.parse(locations)
    },
    create: function(position, name) {
      var newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        name: name
      }
      var locationArray = JSON.parse(localStorage.getItem('__locations')) || []
      locationArray.push(newLocation)
      localStorage.setItem('__locations', JSON.stringify(locationArray))
      return locationArray
    },
    deleteByIndex: function(index) {
      locations = JSON.parse(localStorage.getItem('__locations'))
      locations.splice(index,1)
      localStorage.setItem('__locations', JSON.stringify(locations))
    },
    _rad: function(x) {
      return x * Math.PI / 180;
    },
    getDistance: function(p1, p2) {
      var R = 3959; // Earth’s mean radius in miles
      var dLat = this._rad(p2.latitude - p1.latitude);
      var dLong = this._rad(p2.longitude - p1.longitude);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this._rad(dLat)) * Math.cos(this._rad(dLat))*
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d.toFixed(2) + " miles";
    }
  }
});
