import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateOfferToken } from "../../services/JobRecruitmentService/offerService";
import { Box, Card, Typography, Button, Stack, TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

export const OfferPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [offerData, setOfferData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    try {
      const response = await validateOfferToken(token);

      if (response.success) {
        setOfferData(response.data);
      } else {
        setOfferData({ error: response.message });
      }
    } catch (error) {
      setOfferData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography>Verifying offer...</Typography>
      </Box>
    );
  }

  if (offerData?.error) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography color="error">{offerData.error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          textAlign: "center",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />

          <Typography variant="h5" fontWeight={600}>
            Welcome to the Team 🎉
          </Typography>

          <Typography color="text.secondary">
            Your offer has been successfully confirmed. We’re excited to have
            you join our team.
          </Typography>

          <Typography>
            You can now access your employee dashboard using the credentials
            below.
          </Typography>

          <TextField
            label="Email"
            value={offerData.email}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            label="Temporary Password"
            value={offerData.password}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <Typography fontSize={13} color="text.secondary">
            Please login and change your password after your first login.
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};
