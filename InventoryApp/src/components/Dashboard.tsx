import {
  Card,
  CardContent,
  Typography,
  Grid,
 // useMediaQuery,
 // useTheme,
} from '@mui/material';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import type { AllSeriesType } from '@mui/x-charts/models';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import alphabetStock from '../dataset/GOOGL.json';

const series: AllSeriesType[] = [
  {
    type: 'bar',
    yAxisId: 'volume',
    label: 'Volume',
    color: 'lightgray',
    data: alphabetStock.map((day) => day.volume),
    highlightScope: { highlight: 'item' },
  },
  {
    type: 'line',
    yAxisId: 'price',
    color: 'red',
    label: 'Low',
    data: alphabetStock.map((day) => day.low),
    highlightScope: { highlight: 'item' },
  },
  {
    type: 'line',
    yAxisId: 'price',
    color: 'green',
    label: 'High',
    data: alphabetStock.map((day) => day.high),
  },
];

export default function StockDashboard() {

//  const theme = useTheme();
  //const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        Alphabet Stock Dashboard
      </Typography>

      <Grid container spacing={2}>
        {/* Chart Card */}
        <Grid size={{xs:12, sm:12, md:6, lg:4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Price & Volume
              </Typography>
              <ChartContainer
                series={series}
                height={400}
                xAxis={[
                  {
                    id: 'date',
                    data: alphabetStock.map((day) => new Date(day.date)),
                    scaleType: 'band',
                    valueFormatter: (value) => value.toLocaleDateString(),
                    height: 40,
                  },
                ]}
                yAxis={[
                  {
                    id: 'price',
                    scaleType: 'linear',
                    position: 'left',
                    width: 50,
                  },
                  {
                    id: 'volume',
                    scaleType: 'linear',
                    position: 'right',
                    valueFormatter: (value) =>
                      `${(value / 1_000_000).toLocaleString()}M`,
                    width: 55,
                  },
                ]}
              >
                <ChartsAxisHighlight x="line" />
                <BarPlot />
                <LinePlot />
                <LineHighlightPlot />
                <ChartsXAxis
                  label="Date"
                  axisId="date"
                  tickInterval={(index) => index % 30 === 0}
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsYAxis
                  label="Price (USD)"
                  axisId="price"
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsYAxis
                  label="Volume"
                  axisId="volume"
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsTooltip />
              </ChartContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:12, sm:12, md:6, lg:4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Price & Volume
              </Typography>
              <ChartContainer
                series={series}
                height={400}
                xAxis={[
                  {
                    id: 'date',
                    data: alphabetStock.map((day) => new Date(day.date)),
                    scaleType: 'band',
                    valueFormatter: (value) => value.toLocaleDateString(),
                    height: 40,
                  },
                ]}
                yAxis={[
                  {
                    id: 'price',
                    scaleType: 'linear',
                    position: 'left',
                    width: 50,
                  },
                  {
                    id: 'volume',
                    scaleType: 'linear',
                    position: 'right',
                    valueFormatter: (value) =>
                      `${(value / 1_000_000).toLocaleString()}M`,
                    width: 55,
                  },
                ]}
              >
                <ChartsAxisHighlight x="line" />
                <BarPlot />
                <LinePlot />
                <LineHighlightPlot />
                <ChartsXAxis
                  label="Date"
                  axisId="date"
                  tickInterval={(index) => index % 30 === 0}
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsYAxis
                  label="Price (USD)"
                  axisId="price"
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsYAxis
                  label="Volume"
                  axisId="volume"
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsTooltip />
              </ChartContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:12, sm:12, md:6, lg:4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Price & Volume
              </Typography>
              <ChartContainer
                series={series}
                height={400}
                xAxis={[
                  {
                    id: 'date',
                    data: alphabetStock.map((day) => new Date(day.date)),
                    scaleType: 'band',
                    valueFormatter: (value) => value.toLocaleDateString(),
                    height: 40,
                  },
                ]}
                yAxis={[
                  {
                    id: 'price',
                    scaleType: 'linear',
                    position: 'left',
                    width: 50,
                  },
                  {
                    id: 'volume',
                    scaleType: 'linear',
                    position: 'right',
                    valueFormatter: (value) =>
                      `${(value / 1_000_000).toLocaleString()}M`,
                    width: 55,
                  },
                ]}
              >
                <ChartsAxisHighlight x="line" />
                <BarPlot />
                <LinePlot />
                <LineHighlightPlot />
                <ChartsXAxis
                  label="Date"
                  axisId="date"
                  tickInterval={( index) => index % 30 === 0}
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsYAxis
                  label="Price (USD)"
                  axisId="price"
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsYAxis
                  label="Volume"
                  axisId="volume"
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsTooltip />
              </ChartContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:12, sm:12, md:6, lg:4}}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Price & Volume
              </Typography>
              <ChartContainer
                series={series}
                height={400}
                xAxis={[
                  {
                    id: 'date',
                    data: alphabetStock.map((day) => new Date(day.date)),
                    scaleType: 'band',
                    valueFormatter: (value) => value.toLocaleDateString(),
                    height: 40,
                  },
                ]}
                yAxis={[
                  {
                    id: 'price',
                    scaleType: 'linear',
                    position: 'left',
                    width: 50,
                  },
                  {
                    id: 'volume',
                    scaleType: 'linear',
                    position: 'right',
                    valueFormatter: (value) =>
                      `${(value / 1_000_000).toLocaleString()}M`,
                    width: 55,
                  },
                ]}
              >
                <ChartsAxisHighlight x="line" />
                <BarPlot />
                <LinePlot />
                <LineHighlightPlot />
                <ChartsXAxis
                  label="Date"
                  axisId="date"
                  tickInterval={(index) => index % 30 === 0}
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsYAxis
                  label="Price (USD)"
                  axisId="price"
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsYAxis
                  label="Volume"
                  axisId="volume"
                  tickLabelStyle={{ fontSize: 10 }}
                />
                <ChartsTooltip />
              </ChartContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
