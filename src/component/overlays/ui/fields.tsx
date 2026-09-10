'use client';

import React from 'react';
import { Switch } from '@/component/ui/switch';
import { Label } from '@/component/ui/label';
import { Slider } from '@/component/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/component/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/component/ui/toggle-group';
import { Checkbox } from '@/component/ui/checkbox';
import { Input } from '@/component/ui/input';

type SectionProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
};

export function Section({ title, description, children, className }: SectionProps) {
    return (
        <section className={className}>
            <h2 className="font-chakra text-lg font-bold text-text border-b border-border pb-2">{title}</h2>
            {description && <p className="text-xs text-muted mt-2">{description}</p>}
            <div className="space-y-4 mt-4">{children}</div>
        </section>
    );
}

type FieldProps = {
    label: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
    /** Contenido a la derecha del label (ej: el valor actual de un slider). */
    labelAside?: React.ReactNode;
};

export function Field({ label, hint, children, className, labelAside }: FieldProps) {
    return (
        <div className={className}>
            <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <label className="block text-sm font-medium text-text/90">{label}</label>
                {labelAside}
            </div>
            {children}
            {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
        </div>
    );
}

type TextFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    hint?: string;
    type?: 'text' | 'number';
    min?: number;
    max?: number;
    className?: string;
};

export function TextField({ label, value, onChange, placeholder, hint, type = 'text', min, max, className }: TextFieldProps) {
    return (
        <Field label={label} hint={hint} className={className}>
            <Input
                type={type}
                value={value}
                min={min}
                max={max}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </Field>
    );
}

export type Option = { value: string; label: string; hint?: string };

type SelectFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    hint?: string;
    className?: string;
};

export function SelectField({ label, value, onChange, options, hint, className }: SelectFieldProps) {
    return (
        <Field label={label} hint={hint} className={className}>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    );
}

type OptionCardsProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    hint?: string;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
};

const COLUMN_CLASS: Record<1 | 2 | 3 | 4, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
};

// Radix ToggleGroup usa '' internamente como "nada seleccionado" (lo que emite al deseleccionar
// el item activo), así que un item con value literal '' (ej: el TTL "Siempre" del chat) nunca
// llega a marcarse "on". Se mapea a un token interno para que ese valor legítimo no choque con
// el sentinel de deselección de Radix.
const EMPTY_VALUE_TOKEN = '__option-cards-empty__';
const toRadixValue = (value: string) => (value === '' ? EMPTY_VALUE_TOKEN : value);
const fromRadixValue = (value: string) => (value === EMPTY_VALUE_TOKEN ? '' : value);

export function OptionCards({ label, value, onChange, options, hint, columns = 2, className }: OptionCardsProps) {
    return (
        <Field label={label} hint={hint} className={className}>
            <ToggleGroup
                type="single"
                value={toRadixValue(value)}
                // Un ToggleGroup single permite deseleccionar el item activo, y en ese caso
                // Radix emite ''. Estos controles siempre tienen que tener un valor elegido,
                // así que esa deselección se ignora.
                onValueChange={(next) => {
                    if (next) onChange(fromRadixValue(next));
                }}
                className={`grid w-full gap-2 ${COLUMN_CLASS[columns]}`}
            >
                {options.map((option) => {
                    const isActive = option.value === value;
                    return (
                        <ToggleGroupItem
                            key={option.value}
                            value={toRadixValue(option.value)}
                            className={`h-auto min-w-0 flex-col items-start gap-0 rounded-xl! border border-border bg-bg-2 px-3 py-2 text-left text-sm font-normal text-muted hover:border-neon/40 hover:text-text hover:bg-bg-2 data-[state=on]:border-neon data-[state=on]:bg-neon data-[state=on]:text-bg data-[state=on]:font-bold data-[state=on]:hover:bg-neon`}
                        >
                            <span className="block leading-tight">{option.label}</span>
                            {option.hint && (
                                <span className={`block text-[11px] leading-tight mt-0.5 ${isActive ? 'text-bg/70' : 'text-muted/70'}`}>
                                    {option.hint}
                                </span>
                            )}
                        </ToggleGroupItem>
                    );
                })}
            </ToggleGroup>
        </Field>
    );
}

type SliderFieldProps = {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    formatValue?: (value: number) => string;
    hint?: string;
    className?: string;
};

export function SliderField({ label, value, onChange, min, max, step = 1, formatValue, hint, className }: SliderFieldProps) {
    return (
        <Field
            label={label}
            hint={hint}
            className={className}
            labelAside={
                <span className="text-sm font-mono text-neon tabular-nums">
                    {formatValue ? formatValue(value) : value}
                </span>
            }
        >
            <Slider
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={([next]) => onChange(next)}
            />
        </Field>
    );
}

type ToggleFieldProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    hint?: string;
    className?: string;
};

export function ToggleField({ label, checked, onChange, hint, className }: ToggleFieldProps) {
    const id = React.useId();
    return (
        <div className={className}>
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor={id} className="text-sm font-medium text-text/90">
                    {label}
                </Label>
                <Switch id={id} checked={checked} onCheckedChange={onChange} />
            </div>
            {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
        </div>
    );
}

export type CheckboxItem = { key: string; label: string; checked: boolean };

type CheckboxListProps = {
    label: string;
    items: CheckboxItem[];
    onToggle: (key: string, checked: boolean) => void;
    hint?: string;
    className?: string;
};

export function CheckboxList({ label, items, onToggle, hint, className }: CheckboxListProps) {
    const uid = React.useId();
    return (
        <Field label={label} hint={hint} className={className}>
            <div className="space-y-2">
                {items.map((item) => {
                    const id = `${uid}-${item.key}`;
                    return (
                        <div key={item.key} className="flex items-center gap-2.5 group">
                            <Checkbox
                                id={id}
                                checked={item.checked}
                                onCheckedChange={(next) => onToggle(item.key, next === true)}
                            />
                            <Label
                                htmlFor={id}
                                className="text-sm font-normal text-muted group-hover:text-text transition-colors cursor-pointer"
                            >
                                {item.label}
                            </Label>
                        </div>
                    );
                })}
            </div>
        </Field>
    );
}

const DEFAULT_PRESETS = ['#FFFFFF', '#000000', '#8B5CF6', '#22D3EE', '#9146FF', '#53FC18', '#FF0033'];

/** Acepta hex (#rgb / #rrggbb) o rgb()/rgba() y devuelve el hex normalizado + la opacidad en 0-100. */
export function parseColor(value: string): { hex: string; alpha: number } {
    const fallback = { hex: '#000000', alpha: 100 };
    if (!value) return fallback;

    const rgba = value.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
    if (rgba) {
        const hex = `#${[rgba[1], rgba[2], rgba[3]]
            .map((channel) => Math.min(255, Number(channel)).toString(16).padStart(2, '0'))
            .join('')}`;
        const alpha = rgba[4] === undefined ? 100 : Math.round(parseFloat(rgba[4]) * 100);
        return { hex, alpha };
    }

    const short = value.trim().match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (short) return { hex: `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`, alpha: 100 };

    if (/^#[0-9a-f]{6}$/i.test(value.trim())) return { hex: value.trim(), alpha: 100 };

    return fallback;
}

export function toRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
}

type ColorFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    hint?: string;
    presets?: string[];
    allowAlpha?: boolean;
    className?: string;
};

export function ColorField({ label, value, onChange, hint, presets, allowAlpha = false, className }: ColorFieldProps) {
    const { hex, alpha } = parseColor(value);
    const swatches = presets ?? DEFAULT_PRESETS;

    const emit = (nextHex: string, nextAlpha: number) => {
        onChange(allowAlpha ? toRgba(nextHex, nextAlpha) : nextHex);
    };

    return (
        <Field label={label} hint={hint} className={className}>
            <div className="flex items-center gap-2 flex-wrap">
                {swatches.map((swatch) => {
                    const isActive = swatch.toLowerCase() === hex.toLowerCase();
                    return (
                        <button
                            key={swatch}
                            type="button"
                            title={swatch}
                            aria-label={`Usar el color ${swatch}`}
                            aria-pressed={isActive}
                            onClick={() => emit(swatch, alpha)}
                            className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neon/50 ${
                                isActive ? 'border-neon' : 'border-border'
                            }`}
                            style={{ backgroundColor: swatch }}
                        />
                    );
                })}
                <label
                    className="w-7 h-7 rounded-lg border-2 border-dashed border-border relative overflow-hidden cursor-pointer hover:border-neon/60 transition-colors"
                    title="Elegir otro color"
                >
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-muted pointer-events-none">+</span>
                    <input
                        type="color"
                        value={hex}
                        onChange={(e) => emit(e.target.value, alpha)}
                        className="opacity-0 w-full h-full cursor-pointer"
                        aria-label={`${label}: elegir un color personalizado`}
                    />
                </label>
            </div>

            {allowAlpha && (
                <div className="mt-3">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="text-xs text-muted">Opacidad</span>
                        <span className="text-xs font-mono text-neon tabular-nums">{alpha}%</span>
                    </div>
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[alpha]}
                        onValueChange={([next]) => emit(hex, next)}
                        aria-label={`${label}: opacidad`}
                    />
                </div>
            )}
        </Field>
    );
}
