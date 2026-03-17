import { usePersistedState } from "@/hooks/use-persisted-state";
import { SafetyInfo } from "./types";
import { Input } from "@/components/ui/input";
import { Shield, Phone, Heart, Droplets, Pill, AlertTriangle } from "lucide-react";

export const SafetyCard = () => {
  const [info, setInfo] = usePersistedState<SafetyInfo>("travel-safety", {
    insuranceNumber: "",
    embassyPhone: "",
    localEmergency: "",
    allergies: "",
    bloodType: "",
    emergencyContact: "",
    emergencyContactPhone: "",
    medications: "",
  });

  const update = (key: keyof SafetyInfo, value: string) => {
    setInfo(prev => ({ ...prev, [key]: value }));
  };

  const fields: { key: keyof SafetyInfo; label: string; icon: React.ReactNode; placeholder: string }[] = [
    { key: "insuranceNumber", label: "Seguro Viagem", icon: <Shield className="w-3.5 h-3.5 text-accent" />, placeholder: "Nº da apólice" },
    { key: "embassyPhone", label: "Embaixada", icon: <Phone className="w-3.5 h-3.5 text-accent" />, placeholder: "Telefone" },
    { key: "localEmergency", label: "Emergência Local", icon: <AlertTriangle className="w-3.5 h-3.5 text-warning" />, placeholder: "Polícia, SAMU..." },
    { key: "emergencyContact", label: "Contato de Emergência", icon: <Heart className="w-3.5 h-3.5 text-destructive" />, placeholder: "Nome" },
    { key: "emergencyContactPhone", label: "Tel. Contato", icon: <Phone className="w-3.5 h-3.5 text-destructive" />, placeholder: "Telefone" },
    { key: "bloodType", label: "Tipo Sanguíneo", icon: <Droplets className="w-3.5 h-3.5 text-destructive" />, placeholder: "A+, O-, etc." },
    { key: "allergies", label: "Alergias", icon: <AlertTriangle className="w-3.5 h-3.5 text-warning" />, placeholder: "Penicilina, amendoim..." },
    { key: "medications", label: "Medicamentos", icon: <Pill className="w-3.5 h-3.5 text-accent" />, placeholder: "Uso contínuo" },
  ];

  const filledCount = Object.values(info).filter(v => v.trim()).length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-destructive" />
          <h3 className="text-sm font-bold">Ficha de Emergência</h3>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Tenha tudo à mão em caso de emergência. {filledCount}/{fields.length} preenchidos.
        </p>
      </div>

      <div className="space-y-2">
        {fields.map(f => (
          <div key={f.key} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-1.5">
              {f.icon}
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</span>
            </div>
            <Input
              value={info[f.key]}
              onChange={e => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="h-8 rounded-lg text-xs border-none bg-muted/50 focus-visible:bg-muted"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
