'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Download, Loader2, QrCode } from 'lucide-react';
import * as QRCodeReactModule from 'qrcode.react';
import {
  generateQRCodePNG,
  generateQRCodeSVG,
  downloadFile,
  extractShortCode,
} from '@/lib/qrCodeGenerator';

const QRCodeComponent = QRCodeReactModule.QRCodeSVG || (QRCodeReactModule as any).default;

interface QRCodeModalProps {
  shortUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QRCodeModal({
  shortUrl,
  open,
  onOpenChange,
}: QRCodeModalProps) {
  const [downloading, setDownloading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const shortCode = extractShortCode(shortUrl);

  const handleDownload = async (format: 'png' | 'svg') => {
    setDownloading(true);
    try {
      let blob: Blob;

      if (format === 'png') {
        blob = await generateQRCodePNG(shortUrl, '/logo.jpg', 1000);
      } else {
        blob = await generateQRCodeSVG(shortUrl, '/logo.jpg', 1000);
      }

      const filename = `${shortCode}-qrcode.${format}`;
      downloadFile(blob, filename);

      toast.success(`QR code downloaded as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download QR code as ${format.toUpperCase()}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Generate QR Code
          </DialogTitle>
          <DialogDescription>
            Scan this QR code to access your shortened URL with BroCode branding
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          {/* QR Code Preview */}
          <div
            ref={qrRef}
            className="p-4 bg-white rounded-lg border-2 border-border shadow-md"
          >
            <QRCodeComponent
              value={shortUrl}
              size={200}
              level="H"
              imageSettings={{
                src: '/logo.jpg',
                x: undefined,
                y: undefined,
                height: 50,
                width: 50,
                excavate: true,
              }}
            />
          </div>

          {/* Short URL Display */}
          <div className="w-full text-center">
            <p className="text-sm text-muted-foreground mb-2">Short URL</p>
            <code className="block bg-muted px-3 py-2 rounded text-sm font-mono break-all">
              {shortUrl}
            </code>
          </div>

          {/* Format Info */}
          <div className="w-full text-center text-sm text-muted-foreground">
            <p>Download as:</p>
            <div className="flex gap-2 justify-center mt-2">
              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 rounded text-xs">
                PNG (Raster)
              </span>
              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 rounded text-xs">
                SVG (Vector)
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={downloading}
          >
            Close
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownload('png')}>
                Download as PNG (1000×1000)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('svg')}>
                Download as SVG (Vector)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DialogContent>
    </Dialog>
  );
}
