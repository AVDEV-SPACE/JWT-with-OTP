'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Definește interfața pentru props-urile componentei
interface PasskeyModalProps {
  onClose: () => void; // Aici specifici că onClose este o funcție care nu primește argumente și nu returnează nimic
  redirectToAdmin?: boolean;
}

const PasskeyModal = ({ onClose, redirectToAdmin = false }: PasskeyModalProps) => {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSuccessfulAuth = () => {
    onClose();
    if (redirectToAdmin) {
      const adminPath = '/admin';
      router.push(adminPath);
    }
  };

  const validatePasskey = async (e: React.FormEvent) => { // Adaugă tipul pentru 'e'
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      console.log('Trimit passkey:', passkey);
      const response = await fetch('/api/admin/verify-passkey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passkey }),
        credentials: 'include',
      });

      const responseText = await response.text();
      console.log("Server response text:", responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        setError("Invalid server response");
        return;
      }

      console.log("Server response:", data);

      if (response.ok) {
        localStorage.setItem('adminAuthenticated', JSON.stringify({
          authenticated: true,
          timestamp: Date.now()
        }));

        handleSuccessfulAuth();
      } else {
        setError(data.message || "Invalid access code");
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError("An error occurred during verification");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="shad-alert-dialog flex flex-col justify-between">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between text-white">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => {
                onClose();
                router.push('/');
              }}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please enter your admin access cod "654321"
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp text-white">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  className="shad-otp-slot"
                  index={index}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Submit"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;