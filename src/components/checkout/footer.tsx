
import { Lock, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-8">
      <div className="container mx-auto px-4 max-w-md text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Compra Segura</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Dados Protegidos</span>
          </div>
        </div>
        <div className="text-xs space-y-1">
          <p>
            <strong>Nome da Empresa:</strong> Mago do CTR Soluções Digitais LTDA
          </p>
          <p>
            <strong>CNPJ:</strong> 12.345.678/0001-99
          </p>
          <p>
            <strong>Endereço:</strong> Av. Digital, 123, Sala 4, São Paulo - SP
          </p>
          <p>
            <strong>Contato:</strong>{" "}
            <a
              href="mailto:suporte@magodoctr.com"
              className="hover:underline text-primary"
            >
              suporte@magodoctr.com
            </a>
          </p>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mago do CTR. Todos os direitos reservados.</p>
          <p>
            <a href="#" className="hover:underline">
              Termos de Uso
            </a>{" "}
            &middot;{" "}
            <a href="#" className="hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
