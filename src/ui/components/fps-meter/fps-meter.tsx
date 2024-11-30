import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import type { FC } from 'react';
import { GameStatsUpdate } from 'remiz/events';
import type { GameStatsUpdateEvent } from 'remiz/events';

import { EngineContext } from '../../providers';

import './style.css';

const CHART_MAX_VALUES = 10;
const CHART_LINE_WIDTH = 8;
const CHART_WIDTH = 400;
const CHART_HEIGHT = 120;

const getPointX = (index: number): number => {
  return (index * CHART_WIDTH) / CHART_MAX_VALUES;
};

const getPointY = (value: number, max: number): number => {
  return (CHART_HEIGHT - ((CHART_HEIGHT * value) / max)) + (CHART_LINE_WIDTH / 2);
};

interface FpsMeterProps {
  className?: string
}

export const FpsMeter: FC<FpsMeterProps> = ({ className }) => {
  const { scene } = useContext(EngineContext);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const chartValues = useRef<Array<number>>([]);

  const [fps, setFps] = useState(0);
  const [actorsCount, setActorsCount] = useState(0);

  const updateChart = useCallback((currentFps: number) => {
    const ctx = chartCtxRef.current;
    const values = chartValues.current;

    if (!ctx) {
      return;
    }

    values.push(currentFps);

    if (values.length > CHART_MAX_VALUES) {
      values.shift();
    }

    ctx.clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = CHART_LINE_WIDTH;

    ctx.beginPath();

    const max = Math.max(...values);

    ctx.moveTo(getPointX(values.length - 1), CHART_HEIGHT + CHART_LINE_WIDTH);

    ctx.lineTo(-CHART_LINE_WIDTH, CHART_HEIGHT + CHART_LINE_WIDTH);
    ctx.lineTo(-CHART_LINE_WIDTH, getPointY(values[0], max));
    values.forEach((value, index) => {
      ctx.lineTo(getPointX(index), getPointY(value, max));
    });

    ctx.fill();
    ctx.stroke();
  }, []);

  useEffect(() => {
    const handleGameStateUpdate = (event: GameStatsUpdateEvent): void => {
      const currentFps = Math.round(event.fps);

      setActorsCount(event.actorsCount);

      setFps(currentFps);
      updateChart(currentFps);
    };

    scene.addEventListener(GameStatsUpdate, handleGameStateUpdate);

    return (): void => scene.removeEventListener(GameStatsUpdate, handleGameStateUpdate);
  }, [scene]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    chartCtxRef.current = chartRef.current.getContext('2d');
  }, []);

  return (
    <div className={`game-stats-meter ${className}`}>
      <div className="game-stats-meter__details">
        <span className="game-stats-meter__fps">
          {`${fps} FPS`}
        </span>

        <div className="game-stats-meter__load">
          <span className="game-stats-meter__additional">
            {`Game objects: ${actorsCount}`}
          </span>
        </div>
      </div>

      <canvas
        ref={chartRef}
        className="game-stats-meter__chart"
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
      />
    </div>
  );
};
