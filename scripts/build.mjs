import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const vercelOutput = join(root, ".vercel", "output");
const vercelStatic = join(vercelOutput, "static");

rmSync(dist, { recursive: true, force: true });
rmSync(vercelOutput, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
mkdirSync(vercelStatic, { recursive: true });
mkdirSync(join(root, "assets"), { recursive: true });

// 180x180 PNG used by iOS Safari for Add to Home Screen.
writeFileSync(
  join(root, "assets", "apple-touch-icon.png"),
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAGXRFWHRTb2Z0d2FyZQBBcmJpQ2FsYyBCdWlsZGVyAAAHRklEQVR4nO3db2iVZRzH8c8590za3u5Wm1pJbVqJFKVgC4KCIgiK+KVgEQQVRNwHQRBBr/0ABUGQEFQRxEQQBAUVxJcUahS0FfQiWakpL2u7mzb37s7M5f0QZ7szZ2d2Z2b3nPN9XcKc3Z2f2bnzJnnmUwmEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwStt+gH40ePHiJUuWfPjH379/f+PGjVevXv3lT2ZmZtasWfPQoUOffv7557NmzXrlypVv3bp12bJlf/755w8dOvTpp5+eO3fu5cuXv3Hjxvfff//EiRPPnz//yy+/fP3119euXdvY2Lj99tsHDhz4/vvvnz59+vTp0/fff3/iYq2F/UB7dfTo0dOnT//hhx+ePXv2kSNHvv322z/88MPw8PCFCxd+8sknT548+eSTTz755JOvv/76rVu3vn79+sLCwmPHjn3wwQeff/75f//739evX//LL7+8cuXKzZs3f/zxx9OnT//5558nJye/++67Bw4c+Omnn/b29h44cOCHH3544cKF4+PjR44ceejQoQ8++ODNmzfPnz//q6++Oj8/Py4u7uTJk69evXrEiBFvv/12c3Pz2rVrL1++fPjw4X/99deTJ09+8MEHL168+OqrrxYWFh4/fvzu3bvfvn37lClT/vjjj9u3b79w4cLw8PCHH3546dKlw8PD5ubmN998c+zYsVOnTr3//vtHjx59/vnnk5OTly5d+vDDD48dO/bFF1/s7e2Njo7+6KOPFhYWHj169NSpU2+//fbq1atHjhx58MEHk5OTly9fPnTo0OXLl//1119Pnjz50Ucf7e3tR44c+f7770+ePPnFF1+8fPnyvXv3njlz5s033xwYGPjss89WrVq1Y8eOqVOnfvTRRzdu3Pjbb7+9efPm2rVrX7p06euvv/7FF1+8cOHCb775Zmpq6tSpU8fHx+/fv//IkSOnT58+efLk999//9q1a2fOnLly5cqZM2e+8MIL7du3L126dP/+/UOGDOnr6/vpp58ePXr0kSNHfv/99y+++GLp0qWHDx/+8ssvL1++/Ouvv97Z2blly5b79u3b8ePH79ixY8eOHZs3b/7tt99Onz79nXfeefHFF4+Pjz/44IPbt2+/fPny6dOnH3300bNnzx48eHDp0qWHDh36+uuvv/jii6tXr379+vXw8PCiRYsOHjz4xRdfnJyc7O3t33zzzY8//viECRPWrFnz6KOPrlq1avjw4R9++OGXX375yJEjL126dO3atS+//HJoaOiqVavWrVv3yy+/PH78+PTp09OnT//0008nJyeff/75v//977Nnz75w4cIjjzyyY8eO5ubmXn755S+//PLq1as3b968a9euHThw4NixY0eOHPn5558nJyeffPLJgwcP3r59+9SpU9u3b//hhx/27t37zJkzJ06c+Pzzz9u3b//RRx9NTEz88ccfL168+P7775eUlBw6dOjEiRMnT57c3d1vv/32jRs3fvDBB4cPH77nnnv27t27fPny9evXT5069fnnn4+Pj//ss8/OnDnzwQcf7O3tL1y4cN26dR988MGxY8cOHTp0+vTpV69e/fTTT7du3fr000+HDh36xRdfnJycPHjw4M6dO3/99dfHjx8fGBjY2toaHh5+5MiRgwcP3rx58+uvv/7SSy/du3fv9OnT8/Pzly9fPnny5Pvvv3/8+PG33377hg0bHj16dO7cuY8++mh0dPT48ePHjx+fOnXq5MmT33333Y8//viJEyeOHTt24sSJL7/88ty5c6dOnTr//PPPTZs2femllzZs2PDZZ5+9du3a4cOHzz77bGpq6uTJk69fv/7pp5+Ojo7+7rvvHj16dPjw4fHjx+fOnXvkyJH333//xIkT6enpV69e3b179/Tp0+fOnbt48eIHH3zw7rvvnj179qOPPpryL9I2K0F9qKSk5NSpU7/88svVq1d/8sknR44c+eabbz744IPp6enr16/fvHnz8uXLf/7558ePH79x48bIyMjNmzd/9NFHq1ev3rZt2w8++OCPP/74+PHjJ06c+O2335588smNGzdu3LhxbW3t7bffPnz48JkzZ/7www+HDx/+6KOPzp07d+zYsQMHDvz6669PnDjx3LlzH3/88aVLl86ePfv8888fPXr0+PHj3bt3P3Xq1KlTp06dOnXq1KlTn3zyyZUrV/7kk0+Ojo7+4IMPVq1a9fXXX//2228fO3bsxIkTz549+8ILL9y9e/fGjRs3bNgwNDS0bt26jRs3fvDBB6dOnfr4448fOXKka9euY8eO5ubmU6dOPXr06Icffnj16tXbtm0bGhr66KOPHj16dPTo0X379r3wwgvT09Nnzpz58ssvX7p06dSpU6dOnXr27NnIyMi33377xIkTly5d+v7772fOnDly5Mjhw4eHDh36+uuvz507d+zYsQ8++ODNmzfPnz//q6++Oj8/Py4u7uTJk69evXrEiBFvv/12c3Pz2rVrL1++fPjw4X/99deTJ09+8MEHL168+OqrrxYWFh4/fvzu3bvfvn37lClT/vjjj9u3b79w4cLw8PCHH3546dKlw8PD5ubmN998c+zYsVOnTr3//vtHjx59/vnnk5OTly5d+vDDD48dO/bFF1/s7e2Njo7+6KOPFhYWHj169NSpU2+//fbq1atHjhx58MEHk5OTly9fPnTo0OXLl//1119Pnjz50Ucf7e3tR44c+f7770+ePPnFF1+8fPnyvXv3njlz5s033xwYGPjss89WrVq1Y8eOqVOnfvTRRzdu3Pjbb7+9efPm2rVrX7p06euvv/7FF1+8cOHCb775Zmpq6tSpU8fHx+/fv//IkSOnT58+efLk999//9q1a2fOnLly5cqZM2e+8MIL7du3L126dP/+/UOGDOnr6/vpp58ePXr0kSNHfv/99y+++GLp0qWHDx/+8ssvL1++/Ouvv97Z2blly5b79u3b8ePH79ixY8eOHZs3b/7tt99Onz79nXfeefHFF4+Pjz/44IPbt2+/fPny6dOnH3300bNnzx48eHDp0qWHDh36+uuvv/jii6tXr379+vXw8PCiRYsOHjz4xRdfnJyc7O3t33zzzY8//viECRPWrFnz6KOPrlq1avjw4R9++OGXX375yJEjL126dO3atS+//HJoaOiqVavWrVv3yy+/PH78+PTp09OnT//0008nJyeff/75v//977Nnz75w4cIjjzyyY8eO5ubmXn755S+//PLq1as3b968a9euHThw4NixY0eOHPn5558nJyeffPLJgwcP3r59+9SpU9u3b//hhx/27t37zJkzJ06c+Pzzz9u3b//RRx9NTEz88ccfL168+P7775eUlBw6dOjEiRMnT57c3d1vv/32jRs3fvDBB4cPH77nnnv27t27fPny9evXT5069fnnn4+Pj//ss8/OnDnzwQcf7O3tL1y4cN26dR988MGxY8cOHTp0+vTpV69e/fTTT7du3fr000+HDh36xRdfnJycPHjw4M6dO3/99dfHjx8fGBjY2toaHh5+5MiRgwcP3rx58+uvv/7SSy/du3fv9OnT8/Pzly9fPnny5Pvvv3/8+PG33377hg0bHj16dO7cuY8++mh0dPT48ePHjx+fOnXq5MmT33333Y8//viJEyeOHTt24sSJL7/88ty5c6dOnTr//PPPTZs2femllzZs2PDZZ5+9du3a4cOHzz77bGpq6uTJk69fv/7pp5+Ojo7+7rvvHj16dPjw4fHjx+fOnXvkyJH333//xIkT6enpV69e3b179/Tp0+fOnbt48eIHH3zw7rvvnj179qOPPpryL9I2K0F9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC4n/8B97fQWdHLtdMAAAAASUVORK5CYII=",
    "base64"
  )
);

for (const path of ["index.html", "manifest.webmanifest", "sw.js", "assets", "src"]) {
  cpSync(join(root, path), join(dist, path), { recursive: true });
  cpSync(join(root, path), join(vercelStatic, path), { recursive: true });
}

console.log("Static app built to dist/ and .vercel/output/static/");
