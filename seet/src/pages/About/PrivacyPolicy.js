import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import Head from 'components/Head';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md" className={classes.root}>
      <Head title="Privacy Policy" desc="Privacy Policy" />

      <Box mt={2}>
        <Typography paragraph variant="body2">
          <b>PRIVACY POLICY</b>
        </Typography>
      </Box>

      <Divider style={{ width: '100%' }} />

      <Box mt={2}>
        <Typography paragraph variant="caption">
          Effective date: 2021-04-01
        </Typography>
        <Typography paragraph variant="caption">
          1. <b>Introduction</b>
        </Typography>
        <Typography paragraph variant="caption">
          Welcome to <b> bimlee</b>.
        </Typography>
        <Typography paragraph variant="caption">
          <b>bimlee</b> (“us”, “we”, or “our”) operates <b>bimlee.com</b> (hereinafter referred to as <b>“Service”</b>).
        </Typography>
        <Typography paragraph variant="caption">
          Our Privacy Policy governs your visit to <b>bimlee.com</b>, and explains how we collect, safeguard and
          disclose information that results from your use of our Service.
        </Typography>
        <Typography paragraph variant="caption">
          We use your data to provide and improve Service. By using Service, you agree to the collection and use of
          information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in
          this Privacy Policy have the same meanings as in our Terms and Conditions.
        </Typography>
        <Typography paragraph variant="caption">
          Our Terms and Conditions (<b>“Terms”</b>) govern all use of our Service and together with the Privacy Policy
          constitutes your agreement with us (<b>“agreement”</b>).
        </Typography>
        <Typography paragraph variant="caption">
          2. <b>Definitions</b>
        </Typography>
        <Typography paragraph variant="caption">
          <b>SERVICE</b> means the bimlee.com website operated by bimlee.
        </Typography>
        <Typography paragraph variant="caption">
          <b>PERSONAL DATA</b> means data about a living individual who can be identified from those data (or from those
          and other information either in our possession or likely to come into our possession).
        </Typography>
        <Typography paragraph variant="caption">
          <b>USAGE DATA</b> is data collected automatically either generated by the use of Service or from Service
          infrastructure itself (for example, the duration of a page visit).
        </Typography>
        <Typography paragraph variant="caption">
          <b>COOKIES</b> are small files stored on your device (computer or mobile device).
        </Typography>
        <Typography paragraph variant="caption">
          <b>DATA CONTROLLER</b> means a natural or legal person who (either alone or jointly or in common with other
          persons) determines the purposes for which and the manner in which any personal data are, or are to be,
          processed. For the purpose of this Privacy Policy, we are a Data Controller of your data.
        </Typography>
        <Typography paragraph variant="caption">
          <b>DATA PROCESSORS (OR SERVICE PROVIDERS)</b> means any natural or legal person who processes the data on
          behalf of the Data Controller. We may use the services of various Service Providers in order to process your
          data more effectively.
        </Typography>{' '}
        <Typography paragraph variant="caption">
          <b>DATA SUBJECT</b> is any living individual who is the subject of Personal Data.
        </Typography>
        <Typography paragraph variant="caption">
          <b>THE USER</b> is the individual using our Service. The User corresponds to the Data Subject, who is the
          subject of Personal Data.
        </Typography>
        <Typography paragraph variant="caption">
          3. <b>Information Collection and Use</b>
        </Typography>
        <Typography paragraph variant="caption">
          We collect several different types of information for various purposes to provide and improve our Service to
          you.
        </Typography>
        <Typography paragraph variant="caption">
          4. <b>Types of Data Collected</b>
        </Typography>
        <Typography paragraph variant="caption">
          <b>Personal Data</b>
        </Typography>
        <Typography paragraph variant="caption">
          While using our Service, we may ask you to provide us with certain personally identifiable information that
          can be used to contact or identify you (<b>“Personal Data”</b>). Personally identifiable information may
          include, but is not limited to:
        </Typography>
        <Typography paragraph variant="caption">
          0.1. Email address
        </Typography>
        <Typography paragraph variant="caption">
          0.2. First name and last name
        </Typography>
        <Typography paragraph variant="caption">
          0.3. Phone number
        </Typography>
        <Typography paragraph variant="caption">
          0.4. Address, Country, State, Province, ZIP/Postal code, City
        </Typography>
        <Typography paragraph variant="caption">
          0.5. Cookies and Usage Data
        </Typography>
        <Typography paragraph variant="caption">
          We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other
          information that may be of interest to you. You may opt out of receiving any, or all, of these communications
          from us by following the unsubscribe link.
        </Typography>
        <Typography paragraph variant="caption">
          <b>Usage Data</b>
        </Typography>
        <Typography paragraph variant="caption">
          We may also collect information that your browser sends whenever you visit our Service or when you access
          Service by or through any device (<b>“Usage Data”</b>).
        </Typography>
        <Typography paragraph variant="caption">
          This Usage Data may include information such as your computer’s Internet Protocol address (e.g. IP address),
          browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the
          time spent on those pages, unique device identifiers and other diagnostic data.
        </Typography>
        <Typography paragraph variant="caption">
          When you access Service with a device, this Usage Data may include information such as the type of device you
          use, your device unique ID, the IP address of your device, your device operating system, the type of Internet
          browser you use, unique device identifiers and other diagnostic data.
        </Typography>
        <Typography paragraph variant="caption">
          <b>Tracking Cookies Data</b>
        </Typography>
        <Typography paragraph variant="caption">
          We use cookies and similar tracking technologies to track the activity on our Service and we hold certain
          information.
        </Typography>
        <Typography paragraph variant="caption">
          Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are
          sent to your browser from a website and stored on your device. Other tracking technologies are also used such
          as beacons, tags and scripts to collect and track information and to improve and analyze our Service.
        </Typography>
        <Typography paragraph variant="caption">
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if
          you do not accept cookies, you may not be able to use some portions of our Service.
        </Typography>
        <Typography paragraph variant="caption">
          Examples of Cookies we use:
        </Typography>
        <Typography paragraph variant="caption">
          0.1. <b>Session Cookies:</b> We use Session Cookies to operate our Service.
        </Typography>
        <Typography paragraph variant="caption">
          0.2. <b>Preference Cookies:</b> We use Preference Cookies to remember your preferences and various settings.
        </Typography>
        <Typography paragraph variant="caption">
          0.3. <b>Security Cookies:</b> We use Security Cookies for security purposes.
        </Typography>
        <Typography paragraph variant="caption">
          0.4. <b>Advertising Cookies:</b> Advertising Cookies are used to serve you with advertisements that may be
          relevant to you and your interests.
        </Typography>
        <Typography paragraph variant="caption">
          <b>Other Data</b>
        </Typography>
        <Typography paragraph variant="caption">
          While using our Service, we may also collect the following information: sex, age, date of birth, place of
          birth, passport details, citizenship, registration at place of residence and actual address, telephone number
          (work, mobile), details of documents on education, qualification, professional training, employment
          agreements, <Link href="https://policymaker.io/non-disclosure-agreement/">NDA agreements</Link>, information
          on bonuses and compensation, information on marital status, family members, social security (or other taxpayer
          identification) number, office location and other data.
        </Typography>
        <Typography paragraph variant="caption">
          5. <b>Use of Data</b>
        </Typography>
        <Typography paragraph variant="caption">
          bimlee uses the collected data for various purposes:
        </Typography>
        <Typography paragraph variant="caption">
          0.1. to provide and maintain our Service;
        </Typography>
        <Typography paragraph variant="caption">
          0.2. to notify you about changes to our Service;
        </Typography>
        <Typography paragraph variant="caption">
          0.3. to allow you to participate in interactive features of our Service when you choose to do so;
        </Typography>
        <Typography paragraph variant="caption">
          0.4. to provide customer support;
        </Typography>
        <Typography paragraph variant="caption">
          0.5. to gather analysis or valuable information so that we can improve our Service;
        </Typography>
        <Typography paragraph variant="caption">
          0.6. to monitor the usage of our Service;
        </Typography>
        <Typography paragraph variant="caption">
          0.7. to detect, prevent and address technical issues;
        </Typography>
        <Typography paragraph variant="caption">
          0.8. to fulfil any other purpose for which you provide it;
        </Typography>
        <Typography paragraph variant="caption">
          0.9. to carry out our obligations and enforce our rights arising from any contracts entered into between you
          and us, including for billing and collection;
        </Typography>
        <Typography paragraph variant="caption">
          0.10. to provide you with notices about your account and/or subscription, including expiration and renewal
          notices, email-instructions, etc.;
        </Typography>
        <Typography paragraph variant="caption">
          0.11. to provide you with news, special offers and general information about other goods, services and events
          which we offer that are similar to those that you have already purchased or enquired about unless you have
          opted not to receive such information;
        </Typography>
        <Typography paragraph variant="caption">
          0.12. in any other way we may describe when you provide the information;
        </Typography>
        <Typography paragraph variant="caption">
          0.13. for any other purpose with your consent.
        </Typography>
        <Typography paragraph variant="caption">
          6. <b>Retention of Data</b>
        </Typography>
        <Typography paragraph variant="caption">
          We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy
          Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations
          (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and
          enforce our legal agreements and policies.
        </Typography>
        <Typography paragraph variant="caption">
          We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter
          period, except when this data is used to strengthen the security or to improve the functionality of our
          Service, or we are legally obligated to retain this data for longer time periods.
        </Typography>
        <Typography paragraph variant="caption">
          7. <b>Transfer of Data</b>
        </Typography>
        <Typography paragraph variant="caption">
          Your information, including Personal Data, may be transferred to – and maintained on – computers located
          outside of your state, province, country or other governmental jurisdiction where the data protection laws may
          differ from those of your jurisdiction.
        </Typography>
        <Typography paragraph variant="caption">
          If you are located outside india and choose to provide information to us, please note that we transfer the
          data, including Personal Data, to india and process it there.
        </Typography>
        <Typography paragraph variant="caption">
          Your consent to this Privacy Policy followed by your submission of such information represents your agreement
          to that transfer.
        </Typography>
        <Typography paragraph variant="caption">
          bimlee will take all the steps reasonably necessary to ensure that your data is treated securely and in
          accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organisation
          or a country unless there are adequate controls in place including the security of your data and other
          personal information.
        </Typography>
        <Typography paragraph variant="caption">
          8. <b>Disclosure of Data</b>
        </Typography>
        <Typography paragraph variant="caption">
          We may disclose personal information that we collect, or you provide:
        </Typography>
        <Typography paragraph variant="caption">
          0.1. <b>Business Transaction.</b>
        </Typography>
        <Typography paragraph variant="caption">
          If we or our subsidiaries are involved in a merger, acquisition or asset sale, your Personal Data may be
          transferred.
        </Typography>
        <Typography paragraph variant="caption">
          0.2. <b>Other cases. We may disclose your information also:</b>
        </Typography>
        <Typography paragraph variant="caption">
          0.2.1. to our subsidiaries and affiliates;
        </Typography>
        <Typography paragraph variant="caption">
          0.2.2. to contractors, service providers, and other third parties we use to support our business;
        </Typography>
        <Typography paragraph variant="caption">
          0.2.3. to fulfill the purpose for which you provide it;
        </Typography>
        <Typography paragraph variant="caption">
          0.2.4. for the purpose of including your company’s logo on our website;
        </Typography>
        <Typography paragraph variant="caption">
          0.2.5. for any other purpose disclosed by us when you provide the information;
        </Typography>
        <Typography paragraph variant="caption">
          0.2.6. with your consent in any other cases;
        </Typography>
        <Typography paragraph variant="caption">
          0.2.7. if we believe disclosure is necessary or appropriate to protect the rights, property, or safety of the
          Company, our customers, or others.
        </Typography>
        <Typography paragraph variant="caption">
          9. <b>Security of Data</b>
        </Typography>
        <Typography paragraph variant="caption">
          The security of your data is important to us but remember that no method of transmission over the Internet or
          method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect
          your Personal Data, we cannot guarantee its absolute security.
        </Typography>
        <Typography paragraph variant="caption">
          10. <b>Your Data Protection Rights Under General Data Protection Regulation (GDPR)</b>
        </Typography>
        <Typography paragraph variant="caption">
          If you are a resident of the European Union (EU) and European Economic Area (EEA), you have certain data
          protection rights, covered by GDPR.
        </Typography>
        <Typography paragraph variant="caption">
          We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal
          Data.
        </Typography>
        <Typography paragraph variant="caption">
          {' '}
          If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our
          systems, please email us at <b>bimlee.official@gmail.com</b>.
        </Typography>
        <Typography paragraph variant="caption">
          In certain circumstances, you have the following data protection rights:
        </Typography>
        <Typography paragraph variant="caption">
          0.1. the right to access, update or to delete the information we have on you;
        </Typography>
        <Typography paragraph variant="caption">
          0.2. the right of rectification. You have the right to have your information rectified if that information is
          inaccurate or incomplete;
        </Typography>
        <Typography paragraph variant="caption">
          0.3. the right to object. You have the right to object to our processing of your Personal Data;
        </Typography>
        <Typography paragraph variant="caption">
          0.4. the right of restriction. You have the right to request that we restrict the processing of your personal
          information;
        </Typography>
        <Typography paragraph variant="caption">
          0.5. the right to data portability. You have the right to be provided with a copy of your Personal Data in a
          structured, machine-readable and commonly used format;
        </Typography>
        <Typography paragraph variant="caption">
          0.6. the right to withdraw consent. You also have the right to withdraw your consent at any time where we rely
          on your consent to process your personal information;
        </Typography>
        <Typography paragraph variant="caption">
          Please note that we may ask you to verify your identity before responding to such requests. Please note, we
          may not able to provide Service without some necessary data.
        </Typography>
        <Typography paragraph variant="caption">
          You have the right to complain to a Data Protection Authority about our collection and use of your Personal
          Data. For more information, please contact your local data protection authority in the European Economic Area
          (EEA).
        </Typography>
        <Typography paragraph variant="caption">
          11. <b>Your Data Protection Rights under the California Privacy Protection Act (CalOPPA)</b>
        </Typography>
        <Typography paragraph variant="caption">
          CalOPPA is the first state law in the nation to require commercial websites and online services to post a
          privacy policy. The law’s reach stretches well beyond California to require a person or company in the United
          States (and conceivable the world) that operates websites collecting personally identifiable information from
          California consumers to post a conspicuous privacy policy on its website stating exactly the information being
          collected and those individuals with whom it is being shared, and to comply with this policy.
        </Typography>
        <Typography paragraph variant="caption">
          According to CalOPPA we agree to the following:
        </Typography>
        <Typography paragraph variant="caption">
          0.1. users can visit our site anonymously;
        </Typography>
        <Typography paragraph variant="caption">
          0.2. our Privacy Policy link includes the word “Privacy”, and can easily be found on the home page of our
          website;
        </Typography>
        <Typography paragraph variant="caption">
          0.3. users will be notified of any privacy policy changes on our Privacy Policy Page;
        </Typography>
        <Typography paragraph variant="caption">
          0.4. users are able to change their personal information by emailing us at <b>bimlee.official@gmail.com</b>.
        </Typography>
        <Typography paragraph variant="caption">
          Our Policy on “Do Not Track” Signals:
        </Typography>
        <Typography paragraph variant="caption">
          We honor Do Not Track signals and do not track, plant cookies, or use advertising when a Do Not Track browser
          mechanism is in place. Do Not Track is a preference you can set in your web browser to inform websites that
          you do not want to be tracked.
        </Typography>
        <Typography paragraph variant="caption">
          You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser.
        </Typography>
        <Typography paragraph variant="caption">
          12. <b>Your Data Protection Rights under the California Consumer Privacy Act (CCPA)</b>
        </Typography>
        <Typography paragraph variant="caption">
          If you are a California resident, you are entitled to learn what data we collect about you, ask to delete your
          data and not to sell (share) it. To exercise your data protection rights, you can make certain requests and
          ask us:
        </Typography>
        <Typography paragraph variant="caption">
          <b>0.1. What personal information we have about you. If you make this request, we will return to you:</b>
        </Typography>
        <Typography paragraph variant="caption">
          0.0.1. The categories of personal information we have collected about you.
        </Typography>
        <Typography paragraph variant="caption">
          0.0.2. The categories of sources from which we collect your personal information.
        </Typography>
        <Typography paragraph variant="caption">
          0.0.3. The business or commercial purpose for collecting or selling your personal information.
        </Typography>
        <Typography paragraph variant="caption">
          0.0.4. The categories of third parties with whom we share personal information.
        </Typography>
        <Typography paragraph variant="caption">
          0.0.5. The specific pieces of personal information we have collected about you.
        </Typography>
        <Typography paragraph variant="caption">
          0.0.6. A list of categories of personal information that we have sold, along with the category of any other
          company we sold it to. If we have not sold your personal information, we will inform you of that fact.
        </Typography>
        <Typography paragraph variant="caption">
          0.0.7. A list of categories of personal information that we have disclosed for a business purpose, along with
          the category of any other company we shared it with.
        </Typography>
        <Typography paragraph variant="caption">
          Please note, you are entitled to ask us to provide you with this information up to two times in a rolling
          twelve-month period. When you make this request, the information provided may be limited to the personal
          information we collected about you in the previous 12 months.
        </Typography>
        <Typography paragraph variant="caption">
          <b>
            0.2. To delete your personal information. If you make this request, we will delete the personal information
            we hold about you as of the date of your request from our records and direct any service providers to do the
            same. In some cases, deletion may be accomplished through de-identification of the information. If you
            choose to delete your personal information, you may not be able to use certain functions that require your
            personal information to operate.
          </b>
        </Typography>
        <Typography paragraph variant="caption">
          <b>
            0.3. To stop selling your personal information. We don’t sell or rent your personal information to any third
            parties for any purpose. We do not sell your personal information for monetary consideration. However, under
            some circumstances, a transfer of personal information to a third party, or within our family of companies,
            without monetary consideration may be considered a “sale” under California law. You are the only owner of
            your Personal Data and can request disclosure or deletion at any time.
          </b>
        </Typography>
        <Typography paragraph variant="caption">
          If you submit a request to stop selling your personal information, we will stop making such transfers.
        </Typography>
        <Typography paragraph variant="caption">
          Please note, if you ask us to delete or stop selling your data, it may impact your experience with us, and you
          may not be able to participate in certain programs or membership services which require the usage of your
          personal information to function. But in no circumstances, we will discriminate against you for exercising
          your rights.
        </Typography>
        <Typography paragraph variant="caption">
          To exercise your California data protection rights described above, please send your request(s) by email:{' '}
          <b>bimlee.official@gmail.com</b>.
        </Typography>
        <Typography paragraph variant="caption">
          Your data protection rights, described above, are covered by the CCPA, short for the California Consumer
          Privacy Act. To find out more, visit the official California Legislative Information website. The CCPA took
          effect on 01/01/2020.
        </Typography>
        <Typography paragraph variant="caption">
          13. <b>Service Providers</b>
        </Typography>
        <Typography paragraph variant="caption">
          We may employ third party companies and individuals to facilitate our Service (<b>“Service Providers”</b>),
          provide Service on our behalf, perform Service-related services or assist us in analysing how our Service is
          used.
        </Typography>
        <Typography paragraph variant="caption">
          These third parties have access to your Personal Data only to perform these tasks on our behalf and are
          obligated not to disclose or use it for any other purpose.
        </Typography>
        <Typography paragraph variant="caption">
          14. <b>Analytics</b>
        </Typography>
        <Typography paragraph variant="caption">
          We may use third-party Service Providers to monitor and analyze the use of our Service.
        </Typography>
        <Typography paragraph variant="caption">
          15. <b>CI/CD tools</b>
        </Typography>
        <Typography paragraph variant="caption">
          We may use third-party Service Providers to automate the development process of our Service.
        </Typography>
        <Typography paragraph variant="caption">
          16. <b>Advertising</b>
        </Typography>
        <Typography paragraph variant="caption">
          We may use third-party Service Providers to show advertisements to you to help support and maintain our
          Service.
        </Typography>
        <Typography paragraph variant="caption">
          17. <b>Behavioral Remarketing</b>
        </Typography>
        <Typography paragraph variant="caption">
          We may use remarketing services to advertise on third party websites to you after you visited our Service. We
          and our third-party vendors use cookies to inform, optimise and serve ads based on your past visits to our
          Service.
        </Typography>
        <Typography paragraph variant="caption">
          18. <b>Links to Other Sites</b>
        </Typography>
        <Typography paragraph variant="caption">
          Our Service may contain links to other sites that are not operated by us. If you click a third party link, you
          will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site
          you visit.
        </Typography>
        <Typography paragraph variant="caption">
          We have no control over and assume no responsibility for the content, privacy policies or practices of any
          third party sites or services.
        </Typography>
        <Typography paragraph variant="caption">
          For example, the outlined <Link href="https://policymaker.io/privacy-policy/">privacy policy</Link> has been
          made using <Link href="https://policymaker.io/">PolicyMaker.io</Link>, a free tool that helps create
          high-quality legal documents. PolicyMaker’s{' '}
          <Link href="https://policymaker.io/privacy-policy/">privacy policy generator</Link> is an easy-to-use tool for
          creating a <Link href="https://policymaker.io/blog-privacy-policy/">privacy policy for blog</Link>, website,
          e-commerce store or mobile app.
        </Typography>
        <Typography paragraph variant="caption">
          19.{' '}
          <b>
            <b>Children’s Privacy</b>
          </b>
        </Typography>
        <Typography paragraph variant="caption">
          Our Services are not intended for use by children under the age of 18 (<b>“Child”</b> or <b>“Children”</b>).
        </Typography>
        <Typography paragraph variant="caption">
          We do not knowingly collect personally identifiable information from Children under 18. If you become aware
          that a Child has provided us with Personal Data, please contact us. If we become aware that we have collected
          Personal Data from Children without verification of parental consent, we take steps to remove that information
          from our servers.
        </Typography>
        <Typography paragraph variant="caption">
          20. <b>Changes to This Privacy Policy</b>
        </Typography>
        <Typography paragraph variant="caption">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </Typography>
        <Typography paragraph variant="caption">
          We will let you know via email and/or a prominent notice on our Service, prior to the change becoming
          effective and update “effective date” at the top of this Privacy Policy.
        </Typography>
        <Typography paragraph variant="caption">
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are
          effective when they are posted on this page.
        </Typography>
        <Typography paragraph variant="caption">
          21. <b>Contact Us</b>
        </Typography>
        <Typography paragraph variant="caption">
          If you have any questions about this Privacy Policy, please contact us by email:{' '}
          <b>bimlee.official@gmail.com</b>.
        </Typography>
        <Typography paragraph variant="caption" style={{ marginTop: '5em', fontSize: '0.7em' }}>
          This <Link href="https://policymaker.io/privacy-policy/">Privacy Policy</Link> was created for{' '}
          <b>bimlee.com</b> by <Link href="https://policymaker.io">PolicyMaker.io</Link> on 2021-04-01.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;