import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, DrawingManager } from '@react-google-maps/api';
import { spatialService, Plot } from '../services/spatialService';
import { auth, onAuthStateChanged } from '../services/firebaseService';
import { toast } from 'sonner';
import { useAppStore } from '../store';
import { User } from '../types';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 0,
  lng: 0
};

interface GISPortalProps {
  user: User;
}

const GISPortal: React.FC<GISPortalProps> = ({ user }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '', // Placeholder
    libraries: ['drawing']
  });

  const [plots, setPlots] = useState<Plot[]>([]);
  const { setSelectedPlot } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const fetchedPlots = await spatialService.getPlots(currentUser.uid);
          setPlots(fetchedPlots);
        } catch (error) {
          console.error("Error fetching plots:", error);
        }
      } else {
        setPlots([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const onPolygonComplete = async (polygon: google.maps.Polygon) => {
    if (!auth.currentUser) {
      toast.error('You must be logged in to save plots.');
      return;
    }

    const path = polygon.getPath();
    const coordinates = path.getArray().map(latLng => [latLng.lat(), latLng.lng()]);
    
    const plot: Plot = {
      stewardId: auth.currentUser.uid,
      name: `Plot ${plots.length + 1}`,
      geometry: { type: 'Polygon', coordinates: [coordinates] }
    };
    
    try {
      const id = await spatialService.savePlot(plot);
      setPlots([...plots, { ...plot, id }]);
      toast.success('Plot saved successfully');
    } catch (error: any) {
      toast.error(`Failed to save plot: ${error.message}`);
    }
  };

  return isLoaded ? (
    <div className="h-[600px] w-full glass-card rounded-3xl overflow-hidden border border-white/10 relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
        options={{ mapTypeId: 'satellite' }}
      >
        <DrawingManager
          onPolygonComplete={onPolygonComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              drawingModes: [google.maps.drawing.OverlayType.POLYGON]
            }
          }}
        />
        {plots.map((plot, i) => (
          <Polygon 
            key={i} 
            paths={plot.geometry.coordinates[0].map((coord: any) => ({ lat: coord[0], lng: coord[1] }))}
            onClick={() => setSelectedPlot(plot)}
          />
        ))}
      </GoogleMap>
    </div>
  ) : <></>;
};

export default GISPortal;
