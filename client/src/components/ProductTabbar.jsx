import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React from 'react';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ProductTabbar() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs value={value} onChange={handleChange} variant="scrollable"
        scrollButtons="auto" aria-label="basic tabs example">
          <Tab label="inverter" {...a11yProps(0)} />
          <Tab label="batteries" {...a11yProps(1)} />
          <Tab label="adapter" {...a11yProps(2)} />
          <Tab label="dây cáp" {...a11yProps(3)} />
          <Tab label="phụ kiện" {...a11yProps(4)} />
          <Tab label="đèn mặt trời" {...a11yProps(5)} />
          <Tab label="đồng hồ đo điện" {...a11yProps(6)} />
        </Tabs>
      </Box>
    </Box>
  );
}