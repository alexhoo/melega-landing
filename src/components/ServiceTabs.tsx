import { useId, useRef, useState, type KeyboardEvent } from 'react';
import {
  Cctv,
  CircuitBoard,
  Cpu,
  Factory,
  Flame,
  House,
  Lamp,
  PlugZap,
  Ship,
  Snowflake,
  Sun,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Audience, ServiceGroup, ServiceIcon } from '../data/services';

const ICONS: Record<ServiceIcon, LucideIcon> = {
  zap: Zap,
  circuit: CircuitBoard,
  ship: Ship,
  cpu: Cpu,
  wrench: Wrench,
  lamp: Lamp,
  sun: Sun,
  plug: PlugZap,
  snowflake: Snowflake,
  cctv: Cctv,
  flame: Flame,
};

const TAB_ICONS: Record<Audience, LucideIcon> = { empresa: Factory, hogar: House };

interface Props {
  groups: Record<Audience, ServiceGroup>;
  defaultGroup?: Audience;
}

/** WAI-ARIA tabs. Both panels are always rendered so the content works before hydration. */
export default function ServiceTabs({ groups, defaultGroup = 'empresa' }: Props) {
  const audiences = Object.keys(groups) as Audience[];
  const [active, setActive] = useState<Audience>(defaultGroup);
  const tabRefs = useRef<Partial<Record<Audience, HTMLButtonElement | null>>>({});
  const id = useId();

  function select(next: Audience) {
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = audiences.indexOf(active);
    const last = audiences.length - 1;
    const target = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(audiences[target]);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Tipo de cliente"
        className="inline-flex flex-wrap gap-1 rounded-full border border-transparent bg-white p-1 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.06)]"
      >
        {audiences.map((audience) => {
          const selected = audience === active;
          const Icon = TAB_ICONS[audience];
          return (
            <button
              key={audience}
              ref={(el) => {
                tabRefs.current[audience] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${audience}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${audience}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(audience)}
              onKeyDown={onKeyDown}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-[background-color,color] duration-150 ${
                selected ? 'bg-melega-night text-white' : 'text-melega-ink/70 hover:bg-melega-paper hover:text-melega-ink'
              }`}
            >
              <Icon aria-hidden="true" size={18} strokeWidth={2.25} />
              {groups[audience].label}
            </button>
          );
        })}
      </div>

      {audiences.map((audience) => (
        <div
          key={audience}
          role="tabpanel"
          id={`${id}-panel-${audience}`}
          aria-labelledby={`${id}-tab-${audience}`}
          hidden={audience !== active}
          className="mt-8"
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups[audience].items.map((service) => {
              const Icon = ICONS[service.icon];
              return (
                <li
                  key={service.title}
                  className="rounded-2xl border border-transparent bg-white p-6 shadow-[0_0_0_1px_rgb(0_0_0/0.05),0_1px_2px_rgb(0_0_0/0.05),0_6px_16px_rgb(0_0_0/0.04)]"
                >
                  <span className="inline-grid size-11 place-items-center rounded-xl bg-melega-light/15 text-melega-dark">
                    <Icon aria-hidden="true" size={22} strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-melega-ink">{service.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-melega-ink/70">{service.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
