import { Client, TravelMode, Status, UnitSystem } from '@googlemaps/google-maps-services-js';

export interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ShipmentCostRequest {
  pickupLocation: Location;
  dropLocation: Location;
  vehicleType: string;
  weight: number;
  commodity?: string;
  addOns?: string[];
}

export interface ShipmentCostResponse {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  baseCost: number;
  addOnCosts: number;
  totalCost: number;
  breakdown: {
    distanceCost: number;
    weightCost: number;
    vehicleTypeCost: number;
    addOnsCost: number;
  };
  route?: {
    polyline: string;
    bounds: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
}

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId: string;
  types: string[];
}

export interface DirectionsResult {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  polyline: string;
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  waypoints: Array<{ lat: number; lng: number }>;
}

export class GoogleMapsService {
  private client: Client;
  private apiKey: string;

  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY environment variable is required');
    }
  }

  /**
   * Validate API key by making a simple geocoding request
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await this.client.geocode({
        params: {
          address: 'New York, NY',
          key: this.apiKey,
        },
      });

      return response.data.status === Status.OK;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  /**
   * Geocode an address to get coordinates and additional information
   */
  async geocodeAddress(address: string): Promise<GeocodingResult> {
    try {
      if (!address || address.trim().length === 0) {
        throw new Error('Address cannot be empty');
      }

      const response = await this.client.geocode({
        params: {
          address: address.trim(),
          key: this.apiKey,
        },
      });

      if (response.data.status !== Status.OK) {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }

      if (response.data.results.length === 0) {
        throw new Error('No results found for the provided address');
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        types: result.types,
      };
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw new Error(`Failed to geocode address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Reverse geocode coordinates to get address information
   */
  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult> {
    try {
      const response = await this.client.reverseGeocode({
        params: {
          latlng: { lat, lng },
          key: this.apiKey,
        },
      });

      if (response.data.status !== Status.OK) {
        throw new Error(`Reverse geocoding failed: ${response.data.status}`);
      }

      if (response.data.results.length === 0) {
        throw new Error('No results found for the provided coordinates');
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        types: result.types,
      };
    } catch (error) {
      console.error('Error reverse geocoding coordinates:', error);
      throw new Error(`Failed to reverse geocode coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detailed directions between two locations
   */
  async getDirections(
    origin: Location,
    destination: Location,
    mode: TravelMode = TravelMode.driving,
    waypoints?: Location[]
  ): Promise<DirectionsResult> {
    try {
      // Convert waypoints to string format if provided
      const waypointStrings = waypoints?.map(wp => wp.address) || [];

      const response = await this.client.directions({
        params: {
          origin: origin.address,
          destination: destination.address,
          waypoints: waypointStrings,
          mode,
          key: this.apiKey,
        },
      });

      if (response.data.status !== Status.OK) {
        throw new Error(`Directions request failed: ${response.data.status}`);
      }

      if (response.data.routes.length === 0) {
        throw new Error('No route found between the specified locations');
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      // Extract waypoints from the route
      const waypointCoords = route.legs.map((leg: any) => ({
        lat: leg.start_location.lat,
        lng: leg.start_location.lng,
      }));

      // Add destination to waypoints
      waypointCoords.push({
        lat: route.legs[route.legs.length - 1].end_location.lat,
        lng: route.legs[route.legs.length - 1].end_location.lng,
      });

      return {
        distance: {
          text: leg.distance?.text || '0 km',
          value: leg.distance?.value || 0,
        },
        duration: {
          text: leg.duration?.text || '0 mins',
          value: leg.duration?.value || 0,
        },
        polyline: route.overview_polyline?.points || '',
        bounds: {
          northeast: {
            lat: route.bounds?.northeast.lat || 0,
            lng: route.bounds?.northeast.lng || 0,
          },
          southwest: {
            lat: route.bounds?.southwest.lat || 0,
            lng: route.bounds?.southwest.lng || 0,
          },
        },
        waypoints: waypointCoords,
      };
    } catch (error) {
      console.error('Error getting directions:', error);
      throw new Error(`Failed to get directions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate distance and duration between two locations using Distance Matrix API
   */
  async calculateDistanceAndDuration(
    origin: Location,
    destination: Location,
    mode: TravelMode = TravelMode.driving
  ): Promise<{ distance: { text: string; value: number }; duration: { text: string; value: number } }> {
    try {
      const response = await this.client.distancematrix({
        params: {
          origins: [origin.address],
          destinations: [destination.address],
          mode,
          key: this.apiKey,
          units: UnitSystem.metric,
        },
      });

      if (response.data.status !== Status.OK) {
        throw new Error(`Distance Matrix request failed: ${response.data.status}`);
      }

      const element = response.data.rows[0]?.elements[0];

      if (!element) {
        throw new Error('No distance matrix data available');
      }

      if (element.status !== Status.OK) {
        throw new Error(`Distance calculation failed: ${element.status}`);
      }

      return {
        distance: {
          text: element.distance?.text || '0 km',
          value: element.distance?.value || 0,
        },
        duration: {
          text: element.duration?.text || '0 mins',
          value: element.duration?.value || 0,
        },
      };
    } catch (error) {
      console.error('Error calculating distance and duration:', error);
      throw new Error(`Failed to calculate distance and duration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate shipment cost based on distance, weight, vehicle type, and add-ons
   */
  async calculateShipmentCost(request: ShipmentCostRequest): Promise<ShipmentCostResponse> {
    try {
      // Validate input
      if (!request.pickupLocation?.address || !request.dropLocation?.address) {
        throw new Error('Pickup and drop locations are required');
      }

      if (!request.vehicleType || request.weight <= 0) {
        throw new Error('Valid vehicle type and weight are required');
      }

      // Get detailed directions for route information
      const directions = await this.getDirections(
        request.pickupLocation,
        request.dropLocation
      );

      // Calculate costs
      const distanceInKm = directions.distance.value / 1000;
      const weightInTons = request.weight / 1000; // Assuming weight is in kg

      // Cost per kilometer based on vehicle type
      const vehicleTypeRates = {
        'truck': 15, // ₹15 per km
        'mini_truck': 12, // ₹12 per km
        'tempo': 10, // ₹10 per km
        'pickup': 8, // ₹8 per km
        'tractor_trailer': 20, // ₹20 per km
      };

      const baseRatePerKm = vehicleTypeRates[request.vehicleType as keyof typeof vehicleTypeRates] || 15;

      // Calculate costs
      const distanceCost = distanceInKm * baseRatePerKm;
      const weightCost = weightInTons * 500; // ₹500 per ton
      const vehicleTypeCost = this.getVehicleTypeBaseCost(request.vehicleType);

      // Calculate add-on costs
      const addOnCosts = this.calculateAddOnCosts(request.addOns || [], distanceInKm);

      const baseCost = distanceCost + weightCost + vehicleTypeCost;
      const totalCost = baseCost + addOnCosts;

      return {
        distance: directions.distance,
        duration: directions.duration,
        baseCost: Math.round(baseCost),
        addOnCosts: Math.round(addOnCosts),
        totalCost: Math.round(totalCost),
        breakdown: {
          distanceCost: Math.round(distanceCost),
          weightCost: Math.round(weightCost),
          vehicleTypeCost: Math.round(vehicleTypeCost),
          addOnsCost: Math.round(addOnCosts),
        },
        route: {
          polyline: directions.polyline,
          bounds: directions.bounds,
        },
      };
    } catch (error) {
      console.error('Error calculating shipment cost:', error);
      throw new Error(`Failed to calculate shipment cost: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get base cost for vehicle type
   */
  private getVehicleTypeBaseCost(vehicleType: string): number {
    const baseCosts = {
      'truck': 1000,
      'mini_truck': 800,
      'tempo': 600,
      'pickup': 400,
      'tractor_trailer': 1500,
    };

    return baseCosts[vehicleType as keyof typeof baseCosts] || 1000;
  }

  /**
   * Calculate add-on costs
   */
  private calculateAddOnCosts(addOns: string[], distanceInKm: number): number {
    let totalAddOnCost = 0;

    addOns.forEach(addOn => {
      switch (addOn.toLowerCase()) {
        case 'express_delivery':
          totalAddOnCost += 500; // ₹500 flat rate
          break;
        case 'fragile_handling':
          totalAddOnCost += 300; // ₹300 flat rate
          break;
        case 'temperature_controlled':
          totalAddOnCost += distanceInKm * 2; // ₹2 per km
          break;
        case 'insurance':
          totalAddOnCost += 200; // ₹200 flat rate
          break;
        case 'weekend_delivery':
          totalAddOnCost += 400; // ₹400 flat rate
          break;
        case 'night_delivery':
          totalAddOnCost += 600; // ₹600 flat rate
          break;
        case 'loading_unloading':
          totalAddOnCost += 250; // ₹250 flat rate
          break;
        case 'packaging':
          totalAddOnCost += 150; // ₹150 flat rate
          break;
        default:
          totalAddOnCost += 100; // Default add-on cost
      }
    });

    return totalAddOnCost;
  }

  /**
   * Get elevation data for coordinates
   */
  async getElevation(lat: number, lng: number): Promise<number> {
    try {
      const response = await this.client.elevation({
        params: {
          locations: [{ lat, lng }],
          key: this.apiKey,
        },
      });

      if (response.data.status !== Status.OK) {
        throw new Error(`Elevation request failed: ${response.data.status}`);
      }

      if (response.data.results.length === 0) {
        throw new Error('No elevation data available');
      }

      return response.data.results[0].elevation;
    } catch (error) {
      console.error('Error getting elevation:', error);
      throw new Error(`Failed to get elevation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get timezone information for coordinates
   */
  async getTimezone(lat: number, lng: number, timestamp?: number): Promise<{
    timeZoneId: string;
    timeZoneName: string;
    rawOffset: number;
    dstOffset: number;
  }> {
    try {
      const response = await this.client.timezone({
        params: {
          location: { lat, lng },
          timestamp: timestamp || Math.floor(Date.now() / 1000),
          key: this.apiKey,
        },
      });

      if (response.data.status !== Status.OK) {
        throw new Error(`Timezone request failed: ${response.data.status}`);
      }

      return {
        timeZoneId: response.data.timeZoneId,
        timeZoneName: response.data.timeZoneName,
        rawOffset: response.data.rawOffset,
        dstOffset: response.data.dstOffset,
      };
    } catch (error) {
      console.error('Error getting timezone:', error);
      throw new Error(`Failed to get timezone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
