import { Dataset, AIAnalysis, Report, UserProfile, ChatMessage } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Manish Gupta',
  email: 'manish.gupta@datapilot.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  role: 'Head of Analytics',
  company: 'Global Retail Operations',
  plan: 'Enterprise Pro',
};

export const DEFAULT_USER = INITIAL_USER;

export const MOCK_DATASETS: Dataset[] = [
  {
    id: 'ds-1',
    name: 'sales_data.csv',
    type: 'CSV',
    rows: 25430,
    cols: 14,
    fileSize: '4.8 MB',
    quality: 94,
    lastAnalyzed: '2 hours ago',
    status: 'Analyzed',
    missingRows: 312,
    duplicateRows: 14,
    invalidValues: 28,
    outliers: 42,
    columns: [
      { name: 'Customer_ID', dataType: 'string', missingCount: 0, uniqueCount: 8430 },
      { name: 'Customer_Name', dataType: 'string', missingCount: 12, uniqueCount: 8418 },
      { name: 'Age', dataType: 'number', missingCount: 45, uniqueCount: 62 },
      { name: 'City', dataType: 'string', missingCount: 8, uniqueCount: 124 },
      { name: 'Category', dataType: 'string', missingCount: 0, uniqueCount: 6 },
      { name: 'Product_SKU', dataType: 'string', missingCount: 0, uniqueCount: 180 },
      { name: 'Quantity', dataType: 'number', missingCount: 0, uniqueCount: 45 },
      { name: 'Unit_Price', dataType: 'number', missingCount: 0, uniqueCount: 120 },
      { name: 'Revenue', dataType: 'number', missingCount: 0, uniqueCount: 4820 },
      { name: 'Discount_Pct', dataType: 'number', missingCount: 18, uniqueCount: 10 },
      { name: 'Order_Date', dataType: 'date', missingCount: 0, uniqueCount: 365 },
      { name: 'Payment_Method', dataType: 'string', missingCount: 4, uniqueCount: 5 },
      { name: 'Rating', dataType: 'number', missingCount: 220, uniqueCount: 5 },
      { name: 'Is_Repeat_Customer', dataType: 'boolean', missingCount: 0, uniqueCount: 2 },
    ],
    dataSample: [
      { Customer_ID: 'CUST-1001', Customer_Name: 'Aarav Sharma', Age: 34, City: 'Mumbai', Category: 'Electronics', Product_SKU: 'SKU-E101', Quantity: 2, Unit_Price: 450, Revenue: 900, Discount_Pct: 5, Order_Date: '2026-05-10', Payment_Method: 'Credit Card', Rating: 5, Is_Repeat_Customer: true },
      { Customer_ID: 'CUST-1002', Customer_Name: 'Priya Patel', Age: 28, City: 'Delhi', Category: 'Apparel', Product_SKU: 'SKU-A204', Quantity: 4, Unit_Price: 65, Revenue: 260, Discount_Pct: 10, Order_Date: '2026-05-11', Payment_Method: 'UPI', Rating: 4, Is_Repeat_Customer: false },
      { Customer_ID: 'CUST-1003', Customer_Name: 'Rohan Verma', Age: 42, City: 'Bengaluru', Category: 'Electronics', Product_SKU: 'SKU-E109', Quantity: 1, Unit_Price: 1250, Revenue: 1250, Discount_Pct: 0, Order_Date: '2026-05-11', Payment_Method: 'Net Banking', Rating: 5, Is_Repeat_Customer: true },
      { Customer_ID: 'CUST-1004', Customer_Name: 'Neha Singh', Age: 31, City: 'Pune', Category: 'Home & Kitchen', Product_SKU: 'SKU-H301', Quantity: 3, Unit_Price: 120, Revenue: 360, Discount_Pct: 0, Order_Date: '2026-05-12', Payment_Method: 'Credit Card', Rating: 3, Is_Repeat_Customer: false },
      { Customer_ID: 'CUST-1005', Customer_Name: 'Vikram Joshi', Age: 50, City: 'Hyderabad', Category: 'Footwear', Product_SKU: 'SKU-F102', Quantity: 1, Unit_Price: 180, Revenue: 180, Discount_Pct: 15, Order_Date: '2026-05-13', Payment_Method: 'UPI', Rating: 5, Is_Repeat_Customer: true },
      { Customer_ID: 'CUST-1006', Customer_Name: 'Ananya Roy', Age: 26, City: 'Kolkata', Category: 'Apparel', Product_SKU: 'SKU-A205', Quantity: 2, Unit_Price: 95, Revenue: 190, Discount_Pct: 0, Order_Date: '2026-05-14', Payment_Method: 'Debit Card', Rating: 4, Is_Repeat_Customer: false },
      { Customer_ID: 'CUST-1007', Customer_Name: 'Kabir Mehta', Age: 39, City: 'Ahmedabad', Category: 'Electronics', Product_SKU: 'SKU-E102', Quantity: 1, Unit_Price: 890, Revenue: 890, Discount_Pct: 5, Order_Date: '2026-05-14', Payment_Method: 'Credit Card', Rating: 5, Is_Repeat_Customer: true },
      { Customer_ID: 'CUST-1008', Customer_Name: 'Sanya Malhotra', Age: 33, City: 'Jaipur', Category: 'Beauty', Product_SKU: 'SKU-B401', Quantity: 5, Unit_Price: 42, Revenue: 210, Discount_Pct: 10, Order_Date: '2026-05-15', Payment_Method: 'UPI', Rating: 4, Is_Repeat_Customer: true },
    ],
  },
  {
    id: 'ds-2',
    name: 'customer_data.xlsx',
    type: 'Excel',
    rows: 8320,
    cols: 18,
    fileSize: '3.2 MB',
    quality: 91,
    lastAnalyzed: 'Yesterday',
    status: 'Analyzed',
    missingRows: 420,
    duplicateRows: 22,
    invalidValues: 15,
    outliers: 18,
    columns: [
      { name: 'Customer_ID', dataType: 'string', missingCount: 0, uniqueCount: 8320 },
      { name: 'Name', dataType: 'string', missingCount: 0, uniqueCount: 8312 },
      { name: 'Email', dataType: 'string', missingCount: 14, uniqueCount: 8300 },
      { name: 'Tier', dataType: 'string', missingCount: 0, uniqueCount: 4 },
      { name: 'LTV_Score', dataType: 'number', missingCount: 0, uniqueCount: 650 },
      { name: 'Churn_Risk', dataType: 'string', missingCount: 2, uniqueCount: 3 },
    ],
    dataSample: [
      { Customer_ID: 'CUST-8001', Name: 'Deepak Reddy', Email: 'd.reddy@example.com', Tier: 'Platinum', LTV_Score: 4850, Churn_Risk: 'Low' },
      { Customer_ID: 'CUST-8002', Name: 'Meera Iyer', Email: 'meera.i@example.com', Tier: 'Gold', LTV_Score: 2100, Churn_Risk: 'Low' },
      { Customer_ID: 'CUST-8003', Name: 'Arjun Das', Email: 'arjun.d@example.com', Tier: 'Silver', LTV_Score: 890, Churn_Risk: 'High' },
    ],
  },
  {
    id: 'ds-3',
    name: 'inventory_april.xlsx',
    type: 'Excel',
    rows: 18200,
    cols: 24,
    fileSize: '7.1 MB',
    quality: 97,
    lastAnalyzed: '3 days ago',
    status: 'Clean',
    missingRows: 120,
    duplicateRows: 0,
    invalidValues: 8,
    outliers: 11,
    columns: [
      { name: 'SKU_Code', dataType: 'string', missingCount: 0, uniqueCount: 18200 },
      { name: 'Warehouse_ID', dataType: 'string', missingCount: 0, uniqueCount: 12 },
      { name: 'Stock_Level', dataType: 'number', missingCount: 0, uniqueCount: 420 },
      { name: 'Reorder_Point', dataType: 'number', missingCount: 0, uniqueCount: 50 },
    ],
    dataSample: [
      { SKU_Code: 'SKU-E101', Warehouse_ID: 'WH-NORTH', Stock_Level: 1420, Reorder_Point: 300 },
      { SKU_Code: 'SKU-A204', Warehouse_ID: 'WH-SOUTH', Stock_Level: 450, Reorder_Point: 500 },
    ],
  },
  {
    id: 'ds-4',
    name: 'students_performance.csv',
    type: 'CSV',
    rows: 2150,
    cols: 8,
    fileSize: '1.1 MB',
    quality: 88,
    lastAnalyzed: '5 hours ago',
    status: 'Analyzed',
    missingRows: 180,
    duplicateRows: 8,
    invalidValues: 24,
    outliers: 15,
    columns: [
      { name: 'Student_ID', dataType: 'string', missingCount: 0, uniqueCount: 2150 },
      { name: 'Gender', dataType: 'string', missingCount: 0, uniqueCount: 2 },
      { name: 'Math_Score', dataType: 'number', missingCount: 12, uniqueCount: 95 },
      { name: 'Reading_Score', dataType: 'number', missingCount: 8, uniqueCount: 92 },
      { name: 'Writing_Score', dataType: 'number', missingCount: 15, uniqueCount: 90 },
      { name: 'Prep_Course', dataType: 'string', missingCount: 0, uniqueCount: 2 },
    ],
    dataSample: [
      { Student_ID: 'STU-101', Gender: 'Female', Math_Score: 88, Reading_Score: 92, Writing_Score: 90, Prep_Course: 'Completed' },
      { Student_ID: 'STU-102', Gender: 'Male', Math_Score: 65, Reading_Score: 70, Writing_Score: 68, Prep_Course: 'None' },
    ],
  },
];

export const MOCK_ANALYSIS: AIAnalysis = {
  executiveSummary:
    'Overall dataset health for sales_data.csv is strong (94% quality score). Revenue is heavily driven by Electronics (48.5% total volume) and Apparel (24.2%). Peak purchasing behavior occurs mid-week between 2 PM - 6 PM. High repeat customer loyalty is present in the Platinum tier, yielding 3.4x higher average order values.',
  dataQualityScore: 94,
  keyFindings: [
    {
      finding: 'Revenue Driven by Electronics',
      explanation: 'Electronics SKUs account for $1.24M (48.5%) of total revenue despite making up only 22% of line item entries.',
      metric: '$1.24M (48.5%)',
      importance: 'High',
    },
    {
      finding: 'UPI & Credit Card Dominance',
      explanation: 'Combined digital payment adoption stands at 82.4%, with UPI leading in Tier-2 Indian cities.',
      metric: '82.4% Digital',
      importance: 'Medium',
    },
    {
      finding: 'Missing Rating Correlation',
      explanation: '220 unrated orders primarily coincide with non-repeat buyers onboarded through discount promotions.',
      metric: '220 Missing',
      importance: 'Low',
    },
  ],
  trends: [
    { title: 'Weekly Revenue Trajectory', description: 'Consistently trending upward at +12.4% WoW over the last quarter.', growth: '+12.4%' },
    { title: 'Repeat Customer Conversion', description: 'Repeat buyer proportion grew from 31% to 42% over 90 days.', growth: '+11.0%' },
    { title: 'Average Order Value (AOV)', description: 'AOV climbed from $134.20 to $148.50 per transaction.', growth: '+10.6%' },
  ],
  anomalies: [
    { issue: 'High Revenue Spike on May 12', column: 'Revenue', severity: 'High', description: 'Single bulk purchase of $14,500 recorded in Electronics category.' },
    { issue: 'Negative Discount Values', column: 'Discount_Pct', severity: 'Medium', description: '18 entries contain erroneous negative discount integers (-5%).' },
    { issue: 'Unusual Age Clusters', column: 'Age', severity: 'Low', description: 'Cluster of 12 records reporting age = 99 in city Jaipur.' },
  ],
  businessInsights: [
    'Customers aged 28-35 exhibit the highest repeat purchase probability (64%).',
    'Providing a 10% discount on second purchase boosts 60-day customer retention by 28%.',
    'Regional demand in Mumbai and Delhi generates 41% of overall enterprise margins.',
  ],
  recommendations: [
    {
      title: 'Prioritize Inventory Restocking for Top 5 Electronics SKUs',
      priority: 'High',
      reason: 'Electronics turnover velocity is 2.8x faster than average warehouse supply cycles.',
      supportingMetric: '2.8x Velocity',
    },
    {
      title: 'Automate Discount Integer Validation Rules',
      priority: 'Medium',
      reason: 'Prevents corrupt negative discount values from skewing profit calculations.',
      supportingMetric: '0% Error Target',
    },
    {
      title: 'Launch Targeted Loyalty Campaign in Pune and Hyderabad',
      priority: 'Low',
      reason: 'Tier-2 metro growth rate (+18.4%) exceeds Tier-1 expansion speed.',
      supportingMetric: '+18.4% Growth',
    },
  ],
};

export const INITIAL_ANALYSIS = MOCK_ANALYSIS;

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rep-1',
    title: 'Q2 Sales & Revenue Analysis',
    datasetName: 'sales_data.csv',
    type: 'Sales Analysis',
    createdAt: '2 hours ago',
    status: 'Ready',
    fileSize: '2.4 MB',
    format: 'PDF',
    summary: 'Full breakdown of quarterly sales volume, category revenue share, and regional performance metrics.',
    executiveSummary: 'Full breakdown of quarterly sales volume, category revenue share, and regional performance metrics.',
    metrics: [
      { label: 'Total Revenue', value: '$2,548,200', change: '+14.2%' },
      { label: 'Total Orders', value: '25,430', change: '+8.1%' },
      { label: 'Avg Order Value', value: '$148.50', change: '+6.5%' },
    ],
    recommendationsCount: 4,
    sections: [
      { title: '1. Executive Overview', content: 'Sales volume experienced strong upward momentum across all major categories, led by Electronics ($1.24M).' },
      { title: '2. Revenue Drivers', content: 'Digital payments account for 82.4% of checkout conversions.' },
    ],
  },
  {
    id: 'rep-2',
    title: 'Customer Segmentation & Churn Risk',
    datasetName: 'customer_data.xlsx',
    type: 'Customer Insights',
    createdAt: 'Yesterday',
    status: 'Ready',
    fileSize: '1.8 MB',
    format: 'Excel',
    summary: 'AI analysis of customer tiers, LTV distributions, and high churn risk indicators.',
    executiveSummary: 'AI analysis of customer tiers, LTV distributions, and high churn risk indicators.',
    metrics: [
      { label: 'Total Customers', value: '8,320', change: '+12.0%' },
      { label: 'High Churn Risk', value: '14.2%', change: '-2.1%' },
      { label: 'Avg LTV', value: '$2,450', change: '+18.3%' },
    ],
    recommendationsCount: 3,
    sections: [
      { title: '1. Customer Tier Distribution', content: 'Platinum members produce 3.4x higher average order values.' },
    ],
  },
  {
    id: 'rep-3',
    title: 'Data Quality & Hygiene Audit',
    datasetName: 'students_performance.csv',
    type: 'Data Quality',
    createdAt: '3 days ago',
    status: 'Ready',
    fileSize: '950 KB',
    format: 'CSV',
    summary: 'Comprehensive check for missing fields, duplicate student entries, and outlier test scores.',
    executiveSummary: 'Comprehensive check for missing fields, duplicate student entries, and outlier test scores.',
    metrics: [
      { label: 'Overall Quality', value: '88%', change: '+3.0%' },
      { label: 'Missing Fields', value: '180', change: '-45' },
      { label: 'Duplicates', value: '8', change: '0' },
    ],
    recommendationsCount: 2,
    sections: [
      { title: '1. Data Integrity Audit', content: 'Scanned 2,150 student rows. Found 180 missing test values.' },
    ],
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Hello Manish! I am DataPilot AI, your dedicated Data Analyst assistant powered by Gemini 3.6 Flash. I have loaded sales_data.csv (25,430 rows). How can I assist your investigation today?',
    timestamp: '10:30 AM',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'What are our top performing categories by revenue?',
    timestamp: '10:31 AM',
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: `Here is the revenue breakdown across product categories in sales_data.csv:

- Electronics: $1,235,900 (48.6% of total revenue)
- Apparel: $615,400 (24.2%)
- Home & Kitchen: $382,100 (15.0%)
- Footwear: $214,800 (8.4%)
- Beauty: $98,000 (3.8%)

💡 Insight: Electronics generates nearly half of your revenue with an average basket size of $450.`,
    timestamp: '10:31 AM',
    chartSuggestion: {
      type: 'bar',
      title: 'Revenue by Category ($)',
      data: [
        { name: 'Electronics', value: 1235900 },
        { name: 'Apparel', value: 615400 },
        { name: 'Home & Kitchen', value: 382100 },
        { name: 'Footwear', value: 214800 },
        { name: 'Beauty', value: 98000 },
      ],
    },
  },
];

export const INITIAL_CHAT_MESSAGES = MOCK_CHAT_MESSAGES;

export const CHART_DATA_TRENDS = [
  { month: 'Jan', Sales: 12000, CleanRecords: 11400, Target: 10000 },
  { month: 'Feb', Sales: 14200, CleanRecords: 13800, Target: 11000 },
  { month: 'Mar', Sales: 16800, CleanRecords: 16100, Target: 12000 },
  { month: 'Apr', Sales: 21000, CleanRecords: 20200, Target: 15000 },
  { month: 'May', Sales: 25430, CleanRecords: 24100, Target: 18000 },
  { month: 'Jun', Sales: 28900, CleanRecords: 27500, Target: 22000 },
];

export const CHART_DATA_CATEGORY = [
  { name: 'Electronics', value: 48.5, revenue: 1235900 },
  { name: 'Apparel', value: 24.2, revenue: 615400 },
  { name: 'Home & Kitchen', value: 15.0, revenue: 382100 },
  { name: 'Footwear', value: 8.4, revenue: 214800 },
  { name: 'Beauty', value: 3.9, revenue: 98000 },
];

export const CHART_DATA_ANOMALIES = [
  { day: 'May 10', Normal: 3200, Anomaly: 0 },
  { day: 'May 11', Normal: 3450, Anomaly: 2 },
  { day: 'May 12', Normal: 5100, Anomaly: 14 },
  { day: 'May 13', Normal: 3800, Anomaly: 1 },
  { day: 'May 14', Normal: 4100, Anomaly: 3 },
  { day: 'May 15', Normal: 4300, Anomaly: 0 },
];
