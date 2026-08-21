const { useState, useMemo } = React;

const GRAIN_SIZES = [
  { id: 'fine', label: 'Fine', range: '< 0.25 mm' },
  { id: 'medium', label: 'Medium', range: '0.25 - 0.5 mm' },
  { id: 'coarse', label: 'Coarse', range: '0.5 - 1.0+ mm' },
];

const SORTING = [
  { id: 'poor', label: 'Poorly sorted' },
  { id: 'moderate', label: 'Moderately sorted' },
  { id: 'well', label: 'Well sorted' },
];

const ROUNDNESS = [
  { id: 'angular', label: 'Angular' },
  { id: 'subangular', label: 'Sub-angular' },
  { id: 'subrounded', label: 'Sub-rounded' },
  { id: 'rounded', label: 'Rounded' },
];

const POROSITY_TYPES = [
  { id: 'vesicular', label: 'Vesicular (primary)' },
  { id: 'intergranular_open', label: 'Intergranular, open' },
  { id: 'intergranular_cemented', label: 'Intergranular, cemented' },
  { id: 'none', label: 'None observed' },
];

const ENERGY_SCORE = { fine: 0, medium: 1, coarse: 2 };
const SORTING_SCORE = { well: 0, moderate: 1, poor: 2 };
const ROUND_SCORE = { rounded: 0, subrounded: 1, subangular: 2, angular: 3 };

function energyLevel(grainSize, sorting) {
  const score = ENERGY_SCORE[grainSize] + SORTING_SCORE[sorting];
  if (score <= 1) return 'Low';
  if (score <= 2) return 'Moderate';
  return 'High';
}

function transportDistance(roundness, sorting) {
  const score = ROUND_SCORE[roundness] + SORTING_SCORE[sorting];
  if (score <= 1) return 'Extensive';
  if (score <= 3) return 'Moderate';
  return 'Limited';
}

function reservoirQuality(porosityType, porosityPct) {
  if (porosityType === 'none') {
    return { label: 'Poor', note: 'No effective porosity observed which means it is likely tightly cemented or occluded by matrix.' };
  }
  if (porosityType === 'vesicular') {
    return { label: 'Moderate', note: `Primary vesicular porosity (~${porosityPct}%) is present; reservoir potential is fair if pores are interconnected.` };
  }
  if (porosityType === 'intergranular_open') {
    if (porosityPct >= 15) return { label: 'Good', note: `Open intergranular porosity (~${porosityPct}%) with limited occlusion which shows favourable reservoir character.` };
    return { label: 'Moderate', note: `Intergranular porosity (~${porosityPct}%) is present but modest, reasonable reservoir potential.` };
  }

  if (porosityPct >= 15) return { label: 'Moderate', note: `Porosity (~${porosityPct}%) is measurable but partly occluded by cement so the permeability is likely reduced.` };
  return { label: 'Poor', note: `Low effective porosity (~${porosityPct}%) due to cementation/compaction — reservoir quality is diminished unless secondary dissolution or fracturing intervenes.` };
}

function likelyEnvironments(energy, transport, sorting, roundness) {
  if (energy === 'High' && transport === 'Limited') {
    return {
      settings: ['Proximal fluvial channel', 'Shallow alluvial fan', 'Proximal deltaic (distributary channel)'],
      reasoning: 'High energy with minimal reworking points to rapid deposition close to the sediment source, with little time for grains to be abraded or sorted.',
    };
  }
  if (energy === 'High' && transport === 'Moderate') {
    return {
      settings: ['Braided river / channelized fluvial', 'Proximal deltaic front', 'Upper shoreface'],
      reasoning: 'Strong, variable flow energy combined with only moderate rounding suggests a channelized, higher-energy system with some, but not extensive, transport.',
    };
  }
  if (energy === 'Moderate') {
    return {
      settings: ['Meandering fluvial', 'Delta front / distal deltaic', 'Middle shoreface'],
      reasoning: 'A moderate energy signature with intermediate sorting and rounding is consistent with a transitional setting between high-energy channels and quieter offshore conditions.',
    };
  }
  if (energy === 'Low' && (roundness === 'subrounded' || roundness === 'rounded') && sorting !== 'poor') {
    return {
      settings: ['Distal deltaic', 'Lower shoreface', 'Shallow marine shelf'],
      reasoning: 'Fine, well-sorted, well-rounded grains indicate prolonged transport and reworking under comparatively low, steady energy which are typical of settings further from the source.',
    };
  }
  return {
    settings: ['Distal / offshore transition', 'Low-energy shelf or lagoon'],
    reasoning: 'Low energy conditions with limited reworking suggest a quiet, distal setting, though the sorting/roundness combination is somewhat ambiguous.',
  };
}
function DepositionalInterpreter() {
  const [grainSize, setGrainSize] = useState('medium');
  const [sorting, setSorting] = useState('moderate');
  const [roundness, setRoundness] = useState('subangular');
  const [porosityType, setPorosityType] = useState('intergranular_open');
  const [porosityPct, setPorosityPct] = useState(12);

  function manualSet(setter, value) {
    setter(value);
  }

  const energy = useMemo(() => energyLevel(grainSize, sorting), [grainSize, sorting]);
  const transport = useMemo(() => transportDistance(roundness, sorting), [roundness, sorting]);
  const reservoir = useMemo(() => reservoirQuality(porosityType, porosityPct), [porosityType, porosityPct]);
  const outcome = useMemo(() => likelyEnvironments(energy, transport, sorting, roundness), [energy, transport, sorting, roundness]);

  return (
    <div className="wrap">
      <header className="page-head">
        <div>
          <h1>Sediment Interpreter</h1>
        </div>
      </header>

      <div className="stage">
        <div className="controls-col">
          <div className="control-block">
            <div className="control-label">Grain size</div>
            <div className="chip-group">
              {GRAIN_SIZES.map(g => (
                <button
                  key={g.id}
                  className={`option-chip ${grainSize === g.id ? 'active' : ''}`}
                  onClick={() => manualSet(setGrainSize, g.id)}
                >
                  {g.label}<span className="option-sub">{g.range}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-block">
            <div className="control-label">Sorting</div>
            <div className="chip-group">
              {SORTING.map(s => (
                <button
                  key={s.id}
                  className={`option-chip ${sorting === s.id ? 'active' : ''}`}
                  onClick={() => manualSet(setSorting, s.id)}
                >{s.label}</button>
              ))}
            </div>
          </div>

          <div className="control-block">
            <div className="control-label">Grain roundness</div>
            <div className="chip-group">
              {ROUNDNESS.map(r => (
                <button
                  key={r.id}
                  className={`option-chip ${roundness === r.id ? 'active' : ''}`}
                  onClick={() => manualSet(setRoundness, r.id)}
                >{r.label}</button>
              ))}
            </div>
          </div>

          <div className="control-block">
            <div className="control-label">Porosity type</div>
            <div className="chip-group">
              {POROSITY_TYPES.map(p => (
                <button
                  key={p.id}
                  className={`option-chip ${porosityType === p.id ? 'active' : ''}`}
                  onClick={() => manualSet(setPorosityType, p.id)}
                >{p.label}</button>
              ))}
            </div>
          </div>

          <div className="control-block">
            <div className="rotation-label">
              <span>Estimated porosity</span>
              <span className="value">{porosityPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={porosityPct}
              onChange={e => manualSet(setPorosityPct, Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<DepositionalInterpreter />);
