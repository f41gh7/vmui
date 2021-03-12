import React, {FC, useMemo} from "react";
import {Checkbox, FormControlLabel, Typography} from "@material-ui/core";
import {MetricCategory} from "../../hooks/useSortedCategories";
import {makeStyles} from "@material-ui/core/styles";

export interface LegendItem {
  seriesName: string;
  labelData: {[key: string]: string};
  color: string;
  checked: boolean;
}

export interface LegendProps {
  labels: LegendItem[];
  categories: MetricCategory[];
  onChange: (index: number) => void;
}

const useStyles = makeStyles({
  legendWrapper: {
    display: "grid",
    width: "100%",
    gridTemplateColumns: "repeat(auto-fill, 250px)",
    gridColumnGap: ".5em"
  }
});


export const Legend: FC<LegendProps> = ({labels, onChange, categories}) => {
  const classes = useStyles();

  const commonLabels = useMemo(() => categories.filter(c => c.variations === 1)
    .map(c => `${c.key}: ${labels[0].labelData[c.key]}`), [categories, labels]);

  const uncommonLabels = useMemo(() => categories.filter(c => c.variations !== 1).map(c => c.key), [categories]);

  return <div>
    <div style={{textAlign: "center"}}>{`Legend for ${commonLabels.join(", ")}`}</div>
    <div className={classes.legendWrapper}>
      {labels.map((legendItem: LegendItem, index) =>
        <div key={legendItem.seriesName}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={legendItem.checked}
                onChange={() => {
                  onChange(index);
                }}
                style={{
                  color: legendItem.color,
                }}
              />
            }
            label={<Typography variant="body2">{uncommonLabels.map(l => `${l}: ${legendItem.labelData[l]}`).join(", ")}</Typography>}
          />
        </div>
      )}
    </div>

  </div>;
};