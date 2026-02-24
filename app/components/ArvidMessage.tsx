interface ArvidMessageProps {
  message: string;
}

export default function ArvidMessage({ message }: ArvidMessageProps) {
  return (
    <div className="mt-6 bg-gradient-to-b from-purple-900 to-purple-950 p-4 rounded-xl text-purple-300 text-sm italic border border-purple-900">
      {message}
    </div>
  );
}