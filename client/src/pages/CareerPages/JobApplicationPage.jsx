import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const steps = [
  "Personal Info",
  "Professional Details",
  "Resume & Links",
  "Declaration",
];

export default function JobApplicationPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [agree, setAgree] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState({});

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    currentCompany: "",
    totalExperience: "",
    expectedCTC: "",
    linkedInUrl: "",
  });

  const handleNext = () => {
    if (!validateStep()) return;
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = () => {
    if (!agree) return alert("You must accept terms");

    console.log("Submitting:", form, resumeFile);

    setSubmitted(true);

    setTimeout(() => {
      navigate("/careers");
    }, 5000);
  };

  const validateStep = () => {
    let newError = {};

    if (activeStep === 0) {
      if (!form.firstName.trim()) newError.firstName = "First name is required";
      if (!form.lastName.trim()) newError.lastName = "Last name is required";
      if (!form.email.trim()) newError.email = "Email is required";
    }

    if (activeStep === 1) {
      if (!form.totalExperience.trim())
        newError.totalExperience = "Total experience is required";
      if (!form.expectedCTC.trim())
        newError.expectedCTC = "Expected CTC is required";
    }

    if (activeStep === 2) {
      if (!resumeFile) newError.resumeFile = "Resume is required";
    }

    if (activeStep === 3) {
      if (!agree) newError.agree = "You must accept terms";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      setToast({
        open: true,
        message: "Please complete required fields",
        severity: "error",
      });
      return false;
    }

    return true;
  };

  return (
    <Container maxWidth="md" className="py-16">
      <Typography variant="h4" mb={6}>
        Job Application
      </Typography>

      {submitted ? (
        <Box textAlign="center" mt={10}>
          <Typography variant="h4" gutterBottom>
            ✅ Application Submitted Successfully
          </Typography>

          <Typography mt={2} color="text.secondary">
            Thank you for applying. Our recruitment team will review your
            application.
          </Typography>

          <Typography mt={3} color="text.secondary">
            Redirecting to careers page in few seconds...
          </Typography>
        </Box>
      ) : (
        <>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box mt={8}>
            {/* STEP 1 */}
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    error={!!error.firstName}
                    helperText={error.firstName}
                    fullWidth
                    required
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    required
                    error={!!error.lastName}
                    helperText={error.lastName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    error={!!error.email}
                    helperText={error.email}
                    required
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            )}

            {/* STEP 2 */}
            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Current Company"
                    name="currentCompany"
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Total Experience (Years)"
                    name="totalExperience"
                    type="number"
                    error={!!error.totalExperience}
                    helperText={error.totalExperience}
                    required
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Expected CTC"
                    name="expectedCTC"
                    type="number"
                    error={!!error.expectedCTC}
                    helperText={error.expectedCTC}
                    required
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            )}

            {/* STEP 3 */}
            {activeStep === 2 && (
              <>
                <Button variant="outlined" component="label">
                  Upload Resume
                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                </Button>

                {error.resumeFile && (
                  <Typography color="error" mt={2}>
                    {error.resumeFile}
                  </Typography>
                )}

                <Box mt={4}>
                  <TextField
                    label="LinkedIn URL"
                    name="linkedInUrl"
                    error={!!error.linkedInUrl}
                    required
                    fullWidth
                    onChange={handleChange}
                  />
                </Box>
              </>
            )}

            {/* STEP 4 */}
            {activeStep === 3 && (
              <>
                <Typography mb={3}>
                  I certify that all information provided is true and complete.
                  I authorize the company to verify my credentials and
                  background.
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />
                  }
                  label="I agree to the terms and privacy policy"
                />
              </>
            )}
          </Box>

          {/* ACTION BUTTONS */}
          <Box mt={6} display="flex" justifyContent="space-between">
            {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}

            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="contained" onClick={handleSubmit}>
                Submit Application
              </Button>
            )}
          </Box>
        </>
      )}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
