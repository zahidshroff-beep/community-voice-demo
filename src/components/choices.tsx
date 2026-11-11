import { CHANNELS, DISTRICTS, GENDERS, RESPONDENTS, THEMES } from "@/data/types";
import { Field, Select } from "@/components/ui";
import { useVoice } from "@/lib/store";

export function ChoiceBar({ voices }: { voices: number }) {
  const choices = useVoice((state) => state.choices);
  const setChoice = useVoice((state) => state.setChoice);
  const resetChoices = useVoice((state) => state.resetChoices);

  return (
    <div className="mb-6 rounded-card border border-line bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">Listening choices</p>
        <p className="text-sm text-muted">
          {voices} voices in view
          <button type="button" className="ml-3 text-teal" onClick={resetChoices}>
            Show all voices
          </button>
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Field label="Channel">
          <Select value={choices.channel} onChange={(event) => setChoice("channel", event.target.value)}>
            <option value="all">All channels</option>
            {CHANNELS.map((channel) => (
              <option key={channel}>{channel}</option>
            ))}
          </Select>
        </Field>
        <Field label="Respondent">
          <Select value={choices.respondent} onChange={(event) => setChoice("respondent", event.target.value)}>
            <option value="all">All respondents</option>
            {RESPONDENTS.map((respondent) => (
              <option key={respondent}>{respondent}</option>
            ))}
          </Select>
        </Field>
        <Field label="District">
          <Select value={choices.district} onChange={(event) => setChoice("district", event.target.value)}>
            <option value="all">All districts</option>
            {DISTRICTS.map((district) => (
              <option key={district}>{district}</option>
            ))}
          </Select>
        </Field>
        <Field label="Theme">
          <Select value={choices.theme} onChange={(event) => setChoice("theme", event.target.value)}>
            <option value="all">All themes</option>
            {THEMES.map((theme) => (
              <option key={theme}>{theme}</option>
            ))}
          </Select>
        </Field>
        <Field label="Gender">
          <Select value={choices.gender} onChange={(event) => setChoice("gender", event.target.value)}>
            <option value="all">All genders</option>
            {GENDERS.map((gender) => (
              <option key={gender}>{gender}</option>
            ))}
          </Select>
        </Field>
        <Field label="Search the wording">
          <input
            value={choices.q}
            onChange={(event) => setChoice("q", event.target.value)}
            placeholder="cost, secondary, guide…"
            className="h-11 rounded-lg border border-line bg-paper px-3 text-sm font-normal text-ink placeholder:text-muted"
          />
        </Field>
      </div>
      <p className="mt-3 text-xs text-muted">Choices carry across Pulse, Listen, Analyse, Validate, Gender lens and Government. Safeguarding notes stay out of these views.</p>
    </div>
  );
}
