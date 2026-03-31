import { QRCodeSVG } from 'qrcode.react';
import logo from '@/assets/logo.png';
import { Smartphone, QrCode } from 'lucide-react';

const QRCodePage = () => {
  const kioskUrl = `${window.location.origin}/kiosk`;

  return (
    <div className="p-4 lg:p-8 min-h-full">
      <h1 className="font-display text-4xl text-primary mb-6">QR Code do Cardápio</h1>

      <div className="max-w-lg mx-auto">
        {/* QR Card */}
        <div className="glass-card p-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-lg" />
            <span className="font-display text-3xl text-primary">BURGER HOUSE</span>
          </div>

          <p className="text-muted-foreground">Escaneie o QR Code para acessar o cardápio e fazer seu pedido!</p>

          <div className="bg-foreground p-6 rounded-2xl inline-block">
            <QRCodeSVG
              value={kioskUrl}
              size={240}
              bgColor="hsl(40, 20%, 92%)"
              fgColor="hsl(30, 15%, 8%)"
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <Smartphone className="w-4 h-4" />
            <span>Aponte a câmera do celular para o código acima</span>
          </div>

          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Ou acesse diretamente:</p>
            <p className="text-sm font-medium text-primary break-all">{kioskUrl}</p>
          </div>
        </div>

        {/* Print hint */}
        <div className="mt-6 glass-card p-4 flex items-center gap-3">
          <QrCode className="w-8 h-8 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium">Dica: Imprima este QR Code</p>
            <p className="text-xs text-muted-foreground">
              Cole nas mesas ou na entrada da hamburgueria para que clientes possam fazer pedidos pelo celular.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
