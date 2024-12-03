import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import axios from 'axios';


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface PieProps {
    institute_id: number | undefined;
  }


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig


export function Component({ institute_id }: PieProps) {
  const id = "pie-interactive"
  const [data, setData] = React.useState([])
  const [activeDept, setActiveDept] = React.useState(null)


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/get-deptwise-student-count/${institute_id}`)
        const result = response.data;
        const formattedData = result.map(dept => ({
          dept_name: dept.dept_name,
          student_count: dept.student_count,
          fill: `hsl(${Math.random() * 360}, 50%, 50%)` // Generate a random color for each department
        }))
        setData(formattedData)
        if (formattedData.length > 0) {
          setActiveDept(formattedData[0].dept_name) // Set the first department as active
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }


    fetchData()
  }, [institute_id])


  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.dept_name === activeDept),
    [activeDept, data]
  )
  const departments = React.useMemo(() => data.map((item) => item.dept_name), [data])


  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Department-wise Student Count</CardTitle>
        </div>
        <Select value={activeDept} onValueChange={setActiveDept}>
          <SelectTrigger
            className="ml-auto h-7 w-auto rounded-lg pl-2.5"
            aria-label="Select a department"
          >
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {departments.map((dept) => (
              <SelectItem
                key={dept}
                value={dept}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                  />
                  {dept}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="student_count"
              nameKey="dept_name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius =  0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
 x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data[activeIndex]?.student_count.toLocaleString() || 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Students
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
