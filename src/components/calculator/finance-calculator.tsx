"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Video,
  Users,
  Plane,
  Clapperboard,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
} from "lucide-react";

const JPY_RATE = 150;

// 2025 benchmarks from actual Skill Hunter data
const BENCHMARKS = {
  avgMargin: 70, // Average margin across top video jobs
  goodMargin: 73, // 73%+ is good (most jobs hit this)
  greatMargin: 80, // 80%+ is great
  lowMargin: 53, // Below 53% is the worst they did
  avgJobRevenue: 1800000, // ~¥1.8M average across top 10 jobs
  monthlyOverhead: 2476000, // Total monthly overhead
  workingDaysPerMonth: 20,
};

// Team daily rates based on monthly salaries
const TEAM_RATES = {
  andrew: { name: "Andrew", monthly: 450000, daily: 22500 },
  david: { name: "David", monthly: 450000, daily: 22500 },
  robert: { name: "Robert", monthly: 340000, daily: 17000 },
  paulina: { name: "Paulina", monthly: 300000, daily: 15000 },
  yuki: { name: "Yuki", monthly: 220000, daily: 11000 },
};

function formatJPY(value: number): string {
  return `¥${Math.round(value).toLocaleString()}`;
}

function formatUSD(value: number): string {
  return `$${Math.round(value / JPY_RATE).toLocaleString()}`;
}

function formatCurrency(value: number, showUSD: boolean): string {
  if (showUSD) return formatUSD(value);
  return formatJPY(value);
}

function formatPercent(value: number): string {
  if (!isFinite(value)) return "N/A";
  return `${value.toFixed(1)}%`;
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  hint?: string;
}

function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min = 0,
  max,
  hint,
}: NumberInputProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          step={step}
          min={min}
          max={max}
          className={`${prefix ? "pl-7" : ""} ${suffix ? "pr-14" : ""} h-9 text-sm`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p className="text-[10px] text-muted-foreground leading-tight">
          {hint}
        </p>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "positive" | "negative" | "neutral";
  badge?: string;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend = "neutral",
  badge,
}: MetricCardProps) {
  const trendColor =
    trend === "positive"
      ? "text-emerald-600"
      : trend === "negative"
        ? "text-red-500"
        : "text-foreground";

  const bgColor =
    trend === "positive"
      ? "bg-emerald-50 border-emerald-200"
      : trend === "negative"
        ? "bg-red-50 border-red-200"
        : "";

  return (
    <Card className={`${bgColor} py-4`}>
      <CardContent className="px-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className={`text-2xl font-bold tracking-tight ${trendColor}`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="rounded-lg bg-muted p-2">{icon}</div>
            {badge && (
              <Badge
                variant={
                  trend === "positive"
                    ? "default"
                    : trend === "negative"
                      ? "destructive"
                      : "secondary"
                }
                className="text-[10px]"
              >
                {trend === "positive" && <ArrowUpRight className="size-3" />}
                {trend === "negative" && <ArrowDownRight className="size-3" />}
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Past job presets from 2025 data
const JOB_PRESETS: Record<
  string,
  {
    label: string;
    revenue: number;
    crew: number;
    travel: number;
    equipment: number;
    outsourcing: number;
    other: number;
    days: number;
  }
> = {
  blank: {
    label: "Start Fresh",
    revenue: 0,
    crew: 0,
    travel: 0,
    equipment: 0,
    outsourcing: 0,
    other: 0,
    days: 3,
  },
  "brand-video-large": {
    label: "Brand Video (Large) — e.g. HGI Kyoto ¥3.4M",
    revenue: 3400000,
    crew: 400000,
    travel: 200000,
    equipment: 100000,
    outsourcing: 150000,
    other: 50000,
    days: 8,
  },
  "brand-video-medium": {
    label: "Brand Video (Medium) — e.g. Hilton MICE ¥2M",
    revenue: 2000000,
    crew: 150000,
    travel: 100000,
    equipment: 50000,
    outsourcing: 80000,
    other: 20000,
    days: 5,
  },
  "event-coverage": {
    label: "Event / Conference — e.g. Fukuoka F&B ¥955K",
    revenue: 950000,
    crew: 150000,
    travel: 100000,
    equipment: 30000,
    outsourcing: 50000,
    other: 20000,
    days: 3,
  },
  "small-video": {
    label: "Small Project — e.g. Seeds ¥825K",
    revenue: 825000,
    crew: 60000,
    travel: 50000,
    equipment: 20000,
    outsourcing: 20000,
    other: 10000,
    days: 2,
  },
  "multi-day-shoot": {
    label: "Multi-Day Shoot — e.g. Alan Watts ¥1.5M",
    revenue: 1500000,
    crew: 200000,
    travel: 150000,
    equipment: 80000,
    outsourcing: 80000,
    other: 40000,
    days: 5,
  },
};

export default function FinanceCalculator() {
  const [showUSD, setShowUSD] = useState(false);
  const [includeOverhead, setIncludeOverhead] = useState(true);

  // Project details
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("brand-video");

  // Revenue
  const [quoteAmount, setQuoteAmount] = useState(2000000);

  // Direct Costs
  const [crewCost, setCrewCost] = useState(150000);
  const [travelCost, setTravelCost] = useState(100000);
  const [equipmentCost, setEquipmentCost] = useState(50000);
  const [outsourcingCost, setOutsourcingCost] = useState(80000);
  const [otherDirectCosts, setOtherDirectCosts] = useState(20000);

  // Time Investment
  const [totalDays, setTotalDays] = useState(5);
  const [andrewDays, setAndrewDays] = useState(2);
  const [davidDays, setDavidDays] = useState(3);
  const [robertDays, setRobertDays] = useState(2);
  const [paulinaDays, setPaulinaDays] = useState(0);
  const [yukiDays, setYukiDays] = useState(0);

  const loadPreset = (presetKey: string) => {
    const preset = JOB_PRESETS[presetKey];
    if (!preset) return;
    setQuoteAmount(preset.revenue);
    setCrewCost(preset.crew);
    setTravelCost(preset.travel);
    setEquipmentCost(preset.equipment);
    setOutsourcingCost(preset.outsourcing);
    setOtherDirectCosts(preset.other);
    setTotalDays(preset.days);
  };

  const resetAll = () => {
    setProjectName("");
    setClientName("");
    setProjectType("brand-video");
    setQuoteAmount(2000000);
    setCrewCost(150000);
    setTravelCost(100000);
    setEquipmentCost(50000);
    setOutsourcingCost(80000);
    setOtherDirectCosts(20000);
    setTotalDays(5);
    setAndrewDays(2);
    setDavidDays(3);
    setRobertDays(2);
    setPaulinaDays(0);
    setYukiDays(0);
  };

  const calculations = useMemo(() => {
    // Direct costs
    const totalDirectCosts =
      crewCost + travelCost + equipmentCost + outsourcingCost + otherDirectCosts;

    // Gross profit
    const grossProfit = quoteAmount - totalDirectCosts;
    const grossMargin =
      quoteAmount > 0 ? (grossProfit / quoteAmount) * 100 : 0;

    // Team time cost (opportunity cost based on salary allocation)
    const teamTimeCost =
      andrewDays * TEAM_RATES.andrew.daily +
      davidDays * TEAM_RATES.david.daily +
      robertDays * TEAM_RATES.robert.daily +
      paulinaDays * TEAM_RATES.paulina.daily +
      yukiDays * TEAM_RATES.yuki.daily;

    // Overhead allocation (share of monthly overhead based on days used)
    const overheadPerDay =
      BENCHMARKS.monthlyOverhead / BENCHMARKS.workingDaysPerMonth;
    const overheadAllocation = includeOverhead
      ? totalDays * overheadPerDay
      : 0;

    // Fully loaded costs
    const fullyLoadedCosts =
      totalDirectCosts + teamTimeCost + overheadAllocation;

    // Net profit
    const netProfit = quoteAmount - fullyLoadedCosts;
    const netMargin =
      quoteAmount > 0 ? (netProfit / quoteAmount) * 100 : 0;

    // Daily revenue (revenue per day of work)
    const dailyRevenue = totalDays > 0 ? quoteAmount / totalDays : 0;
    const dailyProfit = totalDays > 0 ? grossProfit / totalDays : 0;

    // Revenue per team-member-day
    const totalTeamDays =
      andrewDays + davidDays + robertDays + paulinaDays + yukiDays;
    const revenuePerTeamDay =
      totalTeamDays > 0 ? quoteAmount / totalTeamDays : 0;

    // Margin health
    const marginRating =
      grossMargin >= BENCHMARKS.greatMargin
        ? "great"
        : grossMargin >= BENCHMARKS.goodMargin
          ? "good"
          : grossMargin >= BENCHMARKS.lowMargin
            ? "ok"
            : "bad";

    return {
      totalDirectCosts,
      grossProfit,
      grossMargin,
      teamTimeCost,
      overheadAllocation,
      fullyLoadedCosts,
      netProfit,
      netMargin,
      dailyRevenue,
      dailyProfit,
      revenuePerTeamDay,
      totalTeamDays,
      marginRating,
    };
  }, [
    quoteAmount,
    crewCost,
    travelCost,
    equipmentCost,
    outsourcingCost,
    otherDirectCosts,
    totalDays,
    andrewDays,
    davidDays,
    robertDays,
    paulinaDays,
    yukiDays,
    includeOverhead,
  ]);

  const isProfitable = calculations.grossProfit > 0;
  const isNetProfitable = calculations.netProfit > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-2.5">
                <Calculator className="size-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Project Profit Calculator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Skill Hunter — Should we take this job?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Label
                htmlFor="currency-toggle"
                className="text-xs text-muted-foreground"
              >
                JPY
              </Label>
              <Switch
                id="currency-toggle"
                checked={showUSD}
                onCheckedChange={setShowUSD}
              />
              <Label
                htmlFor="currency-toggle"
                className="text-xs text-muted-foreground"
              >
                USD
              </Label>
              <Badge variant="outline" className="text-[10px]">
                $1 = ¥{JPY_RATE}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAll}
                className="gap-1 text-xs"
              >
                <RotateCcw className="size-3" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Quick Start — Load from past jobs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clapperboard className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Start — Load a Template
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(JOB_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => loadPreset(key)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Key Metrics Dashboard */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Verdict
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Gross Profit"
              value={formatCurrency(
                Math.abs(calculations.grossProfit),
                showUSD
              )}
              subtitle={`${formatPercent(calculations.grossMargin)} margin`}
              icon={
                isProfitable ? (
                  <TrendingUp className="size-4 text-muted-foreground" />
                ) : (
                  <TrendingDown className="size-4 text-muted-foreground" />
                )
              }
              trend={isProfitable ? "positive" : "negative"}
              badge={
                calculations.marginRating === "great"
                  ? "80%+"
                  : calculations.marginRating === "good"
                    ? "73%+"
                    : calculations.marginRating === "ok"
                      ? "OK"
                      : "Low"
              }
            />
            <MetricCard
              title="Net Profit (Fully Loaded)"
              value={formatCurrency(
                Math.abs(calculations.netProfit),
                showUSD
              )}
              subtitle={`${formatPercent(calculations.netMargin)} after overhead`}
              icon={
                isNetProfitable ? (
                  <TrendingUp className="size-4 text-muted-foreground" />
                ) : (
                  <TrendingDown className="size-4 text-muted-foreground" />
                )
              }
              trend={isNetProfitable ? "positive" : "negative"}
              badge={isNetProfitable ? "Take it" : "Pass"}
            />
            <MetricCard
              title="Profit per Day"
              value={formatCurrency(
                Math.abs(calculations.dailyProfit),
                showUSD
              )}
              subtitle={`${totalDays} working days`}
              icon={<Clock className="size-4 text-muted-foreground" />}
              trend={
                calculations.dailyProfit > 200000
                  ? "positive"
                  : calculations.dailyProfit > 100000
                    ? "neutral"
                    : "negative"
              }
            />
            <MetricCard
              title="Direct Costs"
              value={formatCurrency(calculations.totalDirectCosts, showUSD)}
              subtitle={`${formatPercent(quoteAmount > 0 ? (calculations.totalDirectCosts / quoteAmount) * 100 : 0)} of quote`}
              icon={<Target className="size-4 text-muted-foreground" />}
              trend="neutral"
            />
          </div>
        </div>

        {/* Benchmark Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Margin vs. 2025 Benchmarks
              </span>
            </div>
            <div className="relative h-8 w-full rounded-full bg-muted overflow-hidden">
              {/* Benchmark zones */}
              <div
                className="absolute inset-y-0 left-0 bg-red-200/50"
                style={{ width: `${BENCHMARKS.lowMargin}%` }}
              />
              <div
                className="absolute inset-y-0 bg-amber-200/50"
                style={{
                  left: `${BENCHMARKS.lowMargin}%`,
                  width: `${BENCHMARKS.goodMargin - BENCHMARKS.lowMargin}%`,
                }}
              />
              <div
                className="absolute inset-y-0 bg-emerald-200/50"
                style={{
                  left: `${BENCHMARKS.goodMargin}%`,
                  width: `${100 - BENCHMARKS.goodMargin}%`,
                }}
              />
              {/* Current margin indicator */}
              <div
                className="absolute inset-y-0 w-1 bg-foreground rounded-full transition-all z-10"
                style={{
                  left: `${Math.min(Math.max(calculations.grossMargin, 0), 100)}%`,
                }}
              />
              {/* Labels */}
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-medium">
                <span className="text-red-700">Low (&lt;53%)</span>
                <span className="text-amber-700">OK (53-73%)</span>
                <span className="text-emerald-700">Great (73%+)</span>
              </div>
            </div>
            <div className="mt-1 text-center">
              <span className="text-xs text-muted-foreground">
                Your margin:{" "}
                <span className="font-bold">
                  {formatPercent(calculations.grossMargin)}
                </span>{" "}
                — 2025 average was{" "}
                <span className="font-bold">
                  {formatPercent(BENCHMARKS.avgMargin)}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Input Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Column 1: Project & Revenue */}
          <div className="space-y-4">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Building2 className="size-4" />
                  Project Details
                </CardTitle>
                <CardDescription className="text-xs">
                  What&apos;s the job?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Client Name
                  </Label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Hilton Tokyo"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Project Name
                  </Label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Brand Video — Summer Campaign"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Project Type
                  </Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brand-video">
                        Brand Video
                      </SelectItem>
                      <SelectItem value="event-coverage">
                        Event / Conference
                      </SelectItem>
                      <SelectItem value="promotional">
                        Promotional Video
                      </SelectItem>
                      <SelectItem value="social-content">
                        Social Content Package
                      </SelectItem>
                      <SelectItem value="photo-video">
                        Photo + Video Bundle
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quote Amount */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <DollarSign className="size-4" />
                  Quote / Revenue
                </CardTitle>
                <CardDescription className="text-xs">
                  How much will the client pay?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <NumberInput
                  label="Quote Amount (¥)"
                  value={quoteAmount}
                  onChange={setQuoteAmount}
                  prefix="¥"
                  step={50000}
                  hint="Total invoiced amount for this project"
                />
                {showUSD && (
                  <p className="text-xs text-muted-foreground">
                    ≈ {formatUSD(quoteAmount)}
                  </p>
                )}
                <Separator />
                <NumberInput
                  label="Total Working Days"
                  value={totalDays}
                  onChange={setTotalDays}
                  suffix="days"
                  min={1}
                  max={60}
                  hint="Pre-production + shoot + post-production"
                />
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Revenue per day
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculations.dailyRevenue, showUSD)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Direct Costs */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Video className="size-4" />
                  Direct Costs
                </CardTitle>
                <CardDescription className="text-xs">
                  Out-of-pocket expenses for this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <NumberInput
                  label="Crew / Extra Staff"
                  value={crewCost}
                  onChange={setCrewCost}
                  prefix="¥"
                  step={10000}
                  hint="Freelance camera ops, assistants, models"
                />
                <NumberInput
                  label="Travel & Accommodation"
                  value={travelCost}
                  onChange={setTravelCost}
                  prefix="¥"
                  step={10000}
                  hint="Transport, hotels, meals on location"
                />
                <NumberInput
                  label="Equipment Rental"
                  value={equipmentCost}
                  onChange={setEquipmentCost}
                  prefix="¥"
                  step={5000}
                  hint="Camera gear, lighting, audio, drones"
                />
                <NumberInput
                  label="Outsourcing / Post-Production"
                  value={outsourcingCost}
                  onChange={setOutsourcingCost}
                  prefix="¥"
                  step={10000}
                  hint="Futa, freelance editors, color grading, music"
                />
                <NumberInput
                  label="Other Direct Costs"
                  value={otherDirectCosts}
                  onChange={setOtherDirectCosts}
                  prefix="¥"
                  step={5000}
                  hint="Location fees, permits, props, catering"
                />
                <Separator />
                <div className="flex justify-between text-sm font-bold">
                  <span>Total Direct Costs</span>
                  <span className="text-red-500">
                    {formatCurrency(calculations.totalDirectCosts, showUSD)}
                  </span>
                </div>
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Gross Profit</span>
                    <span
                      className={
                        isProfitable ? "text-emerald-600" : "text-red-500"
                      }
                    >
                      {formatCurrency(
                        Math.abs(calculations.grossProfit),
                        showUSD
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Gross Margin</span>
                    <span>{formatPercent(calculations.grossMargin)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3: Team Time & Fully Loaded */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="size-4" />
                  Team Time Investment
                </CardTitle>
                <CardDescription className="text-xs">
                  Who&apos;s working on this? (salary-based opportunity cost)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    name: "Andrew",
                    rate: TEAM_RATES.andrew,
                    value: andrewDays,
                    setter: setAndrewDays,
                  },
                  {
                    name: "David",
                    rate: TEAM_RATES.david,
                    value: davidDays,
                    setter: setDavidDays,
                  },
                  {
                    name: "Robert",
                    rate: TEAM_RATES.robert,
                    value: robertDays,
                    setter: setRobertDays,
                  },
                  {
                    name: "Paulina",
                    rate: TEAM_RATES.paulina,
                    value: paulinaDays,
                    setter: setPaulinaDays,
                  },
                  {
                    name: "Yuki",
                    rate: TEAM_RATES.yuki,
                    value: yukiDays,
                    setter: setYukiDays,
                  },
                ].map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-3"
                  >
                    <div className="w-16 text-xs font-medium">
                      {member.name}
                    </div>
                    <Input
                      type="number"
                      value={member.value || ""}
                      onChange={(e) =>
                        member.setter(Number(e.target.value) || 0)
                      }
                      min={0}
                      max={30}
                      step={0.5}
                      className="h-8 w-20 text-sm text-center"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      days × {formatJPY(member.rate.daily)}/day
                    </span>
                    <span className="ml-auto text-xs font-medium">
                      {formatCurrency(
                        member.value * member.rate.daily,
                        showUSD
                      )}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm font-medium">
                  <span>
                    Team Time Cost ({calculations.totalTeamDays} person-days)
                  </span>
                  <span>
                    {formatCurrency(calculations.teamTimeCost, showUSD)}
                  </span>
                </div>
                {calculations.totalTeamDays > 0 && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Revenue per team-member-day</span>
                    <span>
                      {formatCurrency(
                        calculations.revenuePerTeamDay,
                        showUSD
                      )}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overhead Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Plane className="size-4" />
                  Overhead Allocation
                </CardTitle>
                <CardDescription className="text-xs">
                  Share of monthly fixed costs (¥2.48M/mo ÷ 20 days)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="overhead-toggle"
                    className="text-xs text-muted-foreground"
                  >
                    Include overhead in net profit?
                  </Label>
                  <Switch
                    id="overhead-toggle"
                    checked={includeOverhead}
                    onCheckedChange={setIncludeOverhead}
                  />
                </div>
                {includeOverhead && (
                  <div className="rounded-lg bg-muted p-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Overhead per day
                      </span>
                      <span>
                        {formatCurrency(
                          BENCHMARKS.monthlyOverhead /
                            BENCHMARKS.workingDaysPerMonth,
                          showUSD
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        × {totalDays} project days
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          calculations.overheadAllocation,
                          showUSD
                        )}
                      </span>
                    </div>
                  </div>
                )}
                <Separator />
                {/* Final P&L */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Quote Amount</span>
                    <span className="text-emerald-600 font-medium">
                      +{formatCurrency(quoteAmount, showUSD)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Direct Costs</span>
                    <span className="text-red-500">
                      −{formatCurrency(calculations.totalDirectCosts, showUSD)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Team Time</span>
                    <span className="text-red-500">
                      −{formatCurrency(calculations.teamTimeCost, showUSD)}
                    </span>
                  </div>
                  {includeOverhead && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Overhead</span>
                      <span className="text-red-500">
                        −
                        {formatCurrency(
                          calculations.overheadAllocation,
                          showUSD
                        )}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div
                    className={`rounded-lg p-4 ${isNetProfitable ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {isNetProfitable ? "Net Profit" : "Net Loss"}
                      </p>
                      <p
                        className={`text-2xl font-bold ${isNetProfitable ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {isNetProfitable ? "+" : "−"}
                        {formatCurrency(
                          Math.abs(calculations.netProfit),
                          showUSD
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Net Margin</span>
                      <span>{formatPercent(calculations.netMargin)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cost Breakdown Visual */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="size-4" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  label: "Crew / Staff",
                  value: crewCost,
                  color: "bg-blue-500",
                },
                {
                  label: "Travel",
                  value: travelCost,
                  color: "bg-amber-500",
                },
                {
                  label: "Equipment",
                  value: equipmentCost,
                  color: "bg-purple-500",
                },
                {
                  label: "Outsourcing",
                  value: outsourcingCost,
                  color: "bg-red-500",
                },
                {
                  label: "Other Direct",
                  value: otherDirectCosts,
                  color: "bg-gray-500",
                },
                {
                  label: "Team Time (salaries)",
                  value: calculations.teamTimeCost,
                  color: "bg-indigo-500",
                },
                ...(includeOverhead
                  ? [
                      {
                        label: "Overhead Share",
                        value: calculations.overheadAllocation,
                        color: "bg-slate-400",
                      },
                    ]
                  : []),
              ].map((item) => {
                const pct =
                  calculations.fullyLoadedCosts > 0
                    ? (item.value / calculations.fullyLoadedCosts) * 100
                    : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.value, showUSD)} (
                        {formatPercent(pct)})
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${item.color}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <Separator />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Costs
                  </p>
                  <p className="text-lg font-bold text-red-500">
                    {formatCurrency(calculations.fullyLoadedCosts, showUSD)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Quote Amount
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(quoteAmount, showUSD)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-xs text-muted-foreground">
                    Net Profit
                  </p>
                  <p
                    className={`text-lg font-bold ${isNetProfitable ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {isNetProfitable ? "+" : "−"}
                    {formatCurrency(Math.abs(calculations.netProfit), showUSD)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2025 Reference Data */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="size-4" />
              2025 Reference — Past Job Margins
            </CardTitle>
            <CardDescription className="text-xs">
              Actual margins from Skill Hunter video production jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-3 font-medium text-muted-foreground">
                      Job
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                      Revenue
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                      Costs
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">
                      Profit
                    </th>
                    <th className="text-right py-2 pl-3 font-medium text-muted-foreground">
                      Margin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      job: "Tsubame (SeaSwallow) — Video/HP/Photos",
                      revenue: 6292000,
                      costs: 1499500,
                    },
                    {
                      job: "HGI Kyoto — Brand Movie",
                      revenue: 3432550,
                      costs: 900000,
                    },
                    {
                      job: "Hilton Tokyo — MICE Video",
                      revenue: 2087800,
                      costs: 400000,
                    },
                    {
                      job: "Hilton Japan — Alan Watts",
                      revenue: 1485979,
                      costs: 550000,
                    },
                    {
                      job: "Hilton Worldwide — Alan Watts 2026",
                      revenue: 1094030,
                      costs: 300000,
                    },
                    {
                      job: "Hilton Fukuoka — F&B Conference",
                      revenue: 954800,
                      costs: 350000,
                    },
                    {
                      job: "Seeds — Takayama Naoko Video",
                      revenue: 825000,
                      costs: 160000,
                    },
                    {
                      job: "Elephant Stone — Canopy Filming",
                      revenue: 665235,
                      costs: 200000,
                    },
                    {
                      job: "Hilton Odawara — Conference",
                      revenue: 528000,
                      costs: 250000,
                    },
                  ].map((row) => {
                    const profit = row.revenue - row.costs;
                    const margin = (profit / row.revenue) * 100;
                    return (
                      <tr key={row.job} className="border-b border-muted">
                        <td className="py-2 pr-3">{row.job}</td>
                        <td className="py-2 px-3 text-right">
                          {formatCurrency(row.revenue, showUSD)}
                        </td>
                        <td className="py-2 px-3 text-right text-red-500">
                          {formatCurrency(row.costs, showUSD)}
                        </td>
                        <td className="py-2 px-3 text-right text-emerald-600 font-medium">
                          {formatCurrency(profit, showUSD)}
                        </td>
                        <td className="py-2 pl-3 text-right">
                          <Badge
                            variant={
                              margin >= 73
                                ? "default"
                                : margin >= 53
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-[10px]"
                          >
                            {formatPercent(margin)}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              Built by MOTTO Digital for Skill Hunter
            </p>
            <p className="text-xs text-muted-foreground">
              Pre-populated with 2025 actuals. All calculations are estimates.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
