declare var Chart: any;

export function initPieChart(selector: string, data: any[], labels: any[], backgroundColor: string[] = [], hoverBorderColor: string = "#ffffff") {
  let canvas = document.querySelector(selector);
  if (backgroundColor.length === 0) {
    backgroundColor = [
      "rgba(0,123,255,0.9)",
      "rgba(0,123,255,0.5)",
      "rgba(0,123,255,0.3)"
    ];
  }
  const chart = new Chart(canvas, {
    type: "pie",
    data: {
      datasets: [
        {
          hoverBorderColor: hoverBorderColor,
          data: data,
          backgroundColor: backgroundColor
        }
      ],
      labels: labels
    },
    options: {
      legend: { position: "bottom", labels: { padding: 25, boxWidth: 20 } },
      cutoutPercentage: 0,
      tooltips: { custom: !1, mode: "index", position: "nearest" }
    }
  });

  return chart;
}
