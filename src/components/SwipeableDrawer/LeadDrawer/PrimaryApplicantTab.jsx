import { useContext } from 'react';
import DrawerSteps from './DrawerSteps';
import { LeadContext } from '../../../context/LeadContextProvider';
import QualifierStep from './QualifierStep';
import DrawerStepBanking from './DrawerStepBanking';
import UploadSteps from './UplodSteps';
import EligibilityStep from './EligibilityStep';
import { Box } from '@mui/material';
import propTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: propTypes.node,
  index: propTypes.number.isRequired,
  value: propTypes.number.isRequired,
};

export default function PrimaryApplicantTab() {
  const { applicantStepsProgress, values, drawerTabIndex, primaryIndex } = useContext(LeadContext);
  const theme = useTheme();
  return (
    <TabPanel
      className='tabPanel'
      style={{ maxHeight: `calc(100vh - 175px)`, overflow: 'auto' }}
      value={drawerTabIndex}
      index={0}
      dir={theme.direction}
    >
      <div className='flex flex-col gap-[16px] w-[100%] pb-[80px] p-[15px]'>
        <DrawerSteps
          key={0}
          details={applicantStepsProgress[0]}
          steps={true}
          index={primaryIndex}
          stepIndex={0}
        />
        <DrawerSteps
          key={1}
          details={applicantStepsProgress[1]}
          steps={true}
          index={primaryIndex}
          stepIndex={1}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100
          }
        />
        <DrawerSteps
          key={2}
          details={applicantStepsProgress[2]}
          steps={true}
          index={primaryIndex}
          stepIndex={2}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100
          }
        />
        <DrawerSteps
          key={3}
          details={applicantStepsProgress[3]}
          steps={true}
          index={primaryIndex}
          stepIndex={3}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100
          }
        />
        <QualifierStep
          key={4}
          details={applicantStepsProgress[4]}
          steps={true}
          index={primaryIndex}
          stepIndex={4}
          noProgress={true}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100 ||
            values?.applicants?.[primaryIndex]?.personal_details?.extra_params?.progress !== 100 ||
            values?.applicants?.[primaryIndex]?.address_detail?.extra_params?.progress !== 100 ||
            values?.applicants?.[primaryIndex]?.work_income_detail?.extra_params?.progress !== 100
          }
        />
        <DrawerSteps
          key={5}
          details={applicantStepsProgress[5]}
          steps={true}
          index={primaryIndex}
          stepIndex={5}
          noProgress={true}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100 ||
            !values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.qualifier
          }
        />
        <DrawerSteps
          key={6}
          details={applicantStepsProgress[6]}
          steps={true}
          index={primaryIndex}
          stepIndex={6}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100
          }
        />
        <DrawerStepBanking
          key={7}
          details={applicantStepsProgress[7]}
          steps={true}
          index={primaryIndex}
          stepIndex={7}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100 ||
            !values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.qualifier
          }
        />
        <DrawerSteps
          key={8}
          details={applicantStepsProgress[8]}
          steps={true}
          index={primaryIndex}
          stepIndex={8}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100
          }
        />
        <UploadSteps
          key={9}
          details={applicantStepsProgress[9]}
          steps={true}
          index={primaryIndex}
          stepIndex={9}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100
          }
        />
        <DrawerSteps
          key={10}
          details={applicantStepsProgress[10]}
          steps={true}
          index={primaryIndex}
          stepIndex={10}
          noProgress={true}
          lock={
            values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.progress !== 100
          }
        />
        <EligibilityStep
          key={11}
          details={applicantStepsProgress[11]}
          steps={true}
          index={primaryIndex}
          stepIndex={11}
          noProgress={true}
          lock={
            values?.lead?.extra_params?.progress_without_eligibility !== 100 ||
            values?.applicants?.length < 2
          }
        />
      </div>
    </TabPanel>
  );
}
