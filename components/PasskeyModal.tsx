'use client';
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

interface PasskeyModalProps {
    onClose: () => void;
    onSuccess: () => void; 
}

const PasskeyModal = ({ onClose, onSuccess }: PasskeyModalProps) => {
    const router = useRouter();
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        setPasskey("");
        setError("");
    }, []);

    const handleSuccessfulAuth = async () => {
        onClose();
        setTimeout(async () => {
            try {
                // Verifică sesiunea după setarea cookie-ului
                const response = await fetch('/api/admin/verify-session', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    console.log('Sesiune confirmată după autentificare, redirecționez la /admin.');
                    onSuccess();
                } else {
                    console.log('Sesiune invalidă după autentificare.');
                    setError("Eroare la confirmarea sesiunii. Te rugăm să încerci din nou.");
                    onClose();
                    router.push('/?admin=true');
                }
            } catch (error) {
                console.error('Eroare la verificarea sesiunii post-autentificare:', error);
                setError("Eroare la confirmarea sesiunii. Te rugăm să încerci din nou.");
                onClose();
                router.push('/?admin=true');
            }
        }, 500); // Crește delay-ul la 500ms
    };

    const validatePasskey = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setError("");

        try {
            console.log('Trimit passkey la /api/admin/verify-passkey...');
            const response = await fetch('/api/admin/verify-passkey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ passkey }),
                credentials: 'include',
            });

            const responseText = await response.text();
            console.log("Server response text from verify-passkey:", responseText);

            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('JSON parse error from verify-passkey response:', parseError);
                setError("Răspuns invalid de la server la verificarea passkey-ului.");
                return;
            }

            console.log("Server response from verify-passkey:", data);

            if (response.ok) {
                handleSuccessfulAuth();
            } else {
                setError(data.message || "Cod de acces invalid");
            }
        } catch (err) {
            console.error('Eroare la verificare în PasskeyModal:', err);
            setError("A apărut o eroare în timpul verificării.");
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
                        Please enter your admin access code "654321"
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div>
                    <InputOTP
                        maxLength={6}
                        value={passkey}
                        onChange={(value) => {
                            setPasskey(value);
                            setError("");
                        }}
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
                        disabled={isVerifying || passkey.length !== 6}
                    >
                        {isVerifying ? "Verifying..." : "Submit"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default PasskeyModal;