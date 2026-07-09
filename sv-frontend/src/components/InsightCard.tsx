import { FaMagnifyingGlass, FaLightbulb } from "react-icons/fa6";

interface Props {
  title: string;
  items: string[];
  variant?: "insight" | "recommendation";
}

export const InsightCard = ({ title, items, variant }: Props) => {
  const Icon = variant === "insight" ? FaMagnifyingGlass : FaLightbulb;

  return (
    <div className={`insight-card insight-card-${variant}`}>
      <h3 className="insight-card_title">
        <Icon className="insight-card_icon" aria-hidden="true" />
        {title}
      </h3>
      <ul className="insight-card_list">
        {items.map((item, i) =>(
            <li key={i} className="insight-card_item">{item}</li>
        ))}
      </ul>
    </div>
  );
};
