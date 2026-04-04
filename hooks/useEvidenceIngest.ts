import { useState } from 'react';
import { uploadMediaShard, saveCollectionItem } from '../services/firebaseService';
import { User, MediaShard } from '../types';
import { toast } from 'sonner';

export const useEvidenceIngest = (user: User) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const ingestEvidence = async (
    file: File, 
    source: string, 
    collectionName: string = 'media_ledger'
  ): Promise<string | null> => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const downloadUrl = await uploadMediaShard(file, (p) => setUploadProgress(p));
      const type = file.type.startsWith('video/') ? 'VIDEO' : file.type.startsWith('audio/') ? 'AUDIO' : 'PAPER';
      
      const newShard: Partial<MediaShard> = {
        title: file.name.split('.')[0],
        type: type as any,
        source: source,
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: Math.random().toString(16).substring(2, 10).toUpperCase(),
        mImpact: (Math.random() * 5).toFixed(2),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        downloadUrl
      };
      
      const id = await saveCollectionItem(collectionName, newShard);
      toast.success("Evidence Shard successfully anchored.");
      return id;
    } catch (err) {
      console.error(err);
      toast.error("Ingest failed. Check network stability.");
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return { ingestEvidence, isUploading, uploadProgress };
};
