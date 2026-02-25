# How to Optimize Windows 10 for Gaming and Performance (01j0thhj7mzwpn1vczbcbykaf5)

Source: How to Optimize Windows 10 for Gaming and Performance (01j0thhj7mzwpn1vczbcbykaf5).html

Readers like you help support MUO. When you make a purchase using links on our site, we may earn an affiliate commission.
Read More.
Windows 10 is a great OS for gamers, mixing native games, supporting retro titles, and even Xbox One streaming. But it isn't perfect straight out of the box.
Some tweaks are required to enjoy the best gaming experience Windows 10 has to offer. Here are several ways to optimize your Windows 10 PC for gaming.
1. Optimize Windows 10 With Gaming Mode
Looking for another option to squeeze the best gaming performance out of Windows 10?
Game Mode is one of the key Windows settings for gaming. When you've Game Mode turned on, your Windows settings are tweaked in a way that optimizes your Windows 10 performance. In a nutshell, it works by managing your system resources and thereby giving you the best performance on your PC. Here's how:
Press
Windows key + I
to launch Windows Settings.
Type in 'game mode' in the search box.
Click
Game Mode settings
or
Turn on Game Mode
.
On the Gaming screen, click
Game Mode
.
Switch to
On
to use Game Mode.
If your PC supports Game Mode, resources will be managed to achieve the optimum frame rate. Additionally, Windows Update will be suspended.
While this is one way to improve gaming performance on Windows 10, Game Mode is not perfect. Jump to the next section to learn some more Windows 10 gaming tweaks.
2. Improve Online Game Performance: Disable Nagle's Algorithm
Nagle's algorithm
essentially bundles data packets at the cost of a smoother internet connection. It's useful but having Nagle's algorithm enabled on your computer may contribute to latency issues when playing games online.
To disable this and improve gaming performance on Windows 10, start by checking your IP address:
Hit the
Windows key + X
keys.
Select
Windows PowerShell
.
Type in "ipconfig" and hit
Enter
.
Look for "IPv4 address" to identify your PC's IP address
With the IP address noted, it's time to edit the Windows Registry. However, be super careful before you
make any changes to the Registry
, as things can easily go haywire. Here's how.
Head to the
Start menu
search bar, type in 'regedit,' and select the best match.
Select
Registry Editor
(tread carefully when fiddling with the Windows Registry)
In the address bar, copy and paste the following path:
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces
In the left-hand pane, you'll see a collection of folders, with filenames comprised of letters and numbers. To access the correct file, match your IP address with the one listed against
DhcpIPAddress
in one of these folders.
When you find your matching folder:
Right-click
on the folder
Select
New > DWORD (32-bit) Value
Name this
TcpAckFrequency
Click
OK
Select
New > DWORD (32-bit) Value
again
Name this one
TCPNoDelay
.
Double-click
on each and set their parameters to
1
That's it. Do this and you will disable Nagle's Algorithm. If you run into any problems, reset the parameter values to
0
, and they will be disabled.
3. Optimize Windows 10 Online Gaming With Faster DNS
If you're
playing online multiplayer
or relying on a remote server for Windows 10 gaming, network traffic can cause problems.
While upgrading to faster internet can help, it's quicker and cheaper to just make some networking tweaks.
Hit
Windows + I
to open the
Settings
app.
Find
Network and Internet > Change Adapter Settings
.
Right-click on your wireless network.
Select
Properties
.
Highlight
Internet Protocol Version 4
.
Make a note of the two DNS entries for future reference.
Replace them with
1.1.1.1
and
1.0.0.1
Click
OK
, and then select
Close
.
Restart your default browser.
Your internet should now be faster, which will help with online gaming.
4. Disable Automatic Updates for the Best Gaming PC Settings
Windows 10 will automatically update your OS and schedule a restart without your permission. While this feature doesn't activate often, you never want to be caught unaware and risk your game save.
Not only can automatic updates restart Windows without warning, but downloading updates in the background will limit your network connectivity.
While you cannot disable automatic restart, it can be delayed. To reduce the chance of Windows Update downloads interrupting your gaming performance:
Open Settings with
Windows key + I
Click
Update and Security >
Windows Update
Look for
Advanced options
then click
Update Options
Disable
Restart this device as soon as possible when a restart is required to install an update
Enable
Show a notification
(Windows will give plenty of warning when the system is going to restart following an update)
Use
Pause updates
to delay installation of updates for up to 7 days
By specifying when you'll be using Windows 10, you can
prevent Windows Updates from downloading and installing
during active hours.
5. Disable Notifications in Windows 10
The
Focus Assist feature in Windows 10
lets you specify how and when you receive notifications.
Popups and chimes usually accompany notifications, but these can interrupt games. Focus Assist lets you manage what level of focus you devote to your work. To optimize your Windows gaming with Focus Assist, follow the steps below:
Hit
Windows + I
to open
Settings
.
Click
System > Focus Assist
.
Select
Alarms Only
to hide all other notifications.
Ensure
When I'm playing a game
is set to
On
.
That's it. This will minimize the impact of notifications, making them available to check later.
6. Prevent Steam Auto-Updating Games
If you use Windows to play games, you're probably buying and installing games via Steam.
One of the largest annoyances with Steam is its update feature. This blocks you from preventing automatic updates across all your games. This may eat up memory by updating games you don't play or limiting your network connectivity with background updates.
To prevent Steam from updating games in the background:
Launch the Steam client.
Open
Steam > Settings > Downloads
.
Uncheck
Allow downloads during gameplay
.
You can also prevent Steam from downloading updates for largely unused games:
Open the Steam
Library
.
Right-click
an underused but installed game.
Select
Properties
then
Updates
.
Under Automatic Updates change
Always keep this game up to date
to
Only update this game when I launch it
.
Ensure
Pause background downloads while I'm playing
is selected under Background Downloads.
With Steam correctly optimized, Windows 10 will be ready for AAA gaming.
7. Tweak Windows 10 Visual Effects for Game Improvements
Your computer’s graphical user interface (GUI) can be a hindrance to your processing power. By default, your Windows 10 appearance settings are set to impress.
Games running in the foreground may conflict with a shiny GUI running in the background. Adjust these settings to optimize Windows 10 for gaming performance.
Open Settings with
Windows key + I
.
Type in "performance" and select
Adjust the appearance and performance of Windows
.
In the settings box, select
Adjust for best performance
.
Click
Apply
.
Click on the
Advanced
tab.
Ensure that
Adjust the best performance of
is set to
Programs
.
Apply
again, and then click on
OK
to confirm.
8. Tweak Your Mouse Settings for Windows 10 Gaming
Could your mouse be impacting gaming performance on Windows 10? To find out, it's a smart idea to optimize your mouse settings. A feature called pointer precision, also known as
mouse acceleration
, can impact how your mouse performs in games; Disabling it can help to optimize gaming in Windows 10. Here's how you can do that:
Open
Settings
.
Click
Devices > Mouse
.
View the
Pointer Options
tab.
Clear the
Enhance pointer precision
checkmark.
Click
Apply
.
Click
OK
to exit---you might also adjust the pointer speed to suit.
If gaming has improved, your mouse was almost certainly slowing things down.
9. Max Power Plan to Improve Windows 10 Gaming Performance
Power options are often ignored due to their supposedly negligible effect. Some gamers claim adjusting for higher performance works, while others fail to notice any difference by changing their PC power settings.
The only way to know for sure is to test it out on your PC. To change your power settings:
Open
Settings
.
Type in "power" and click
Power & sleep settings > Additional power settings
.
Select the
high-performance
option.
If none is available, use
Create a power plan
to configure a new, custom power plan
This option will allow your PC to perform better at the cost of higher energy consumption and temperature levels. For this reason, it's better to activate this Windows 10 optimization on the desktop rather than on laptop PCs.
10. Keep Your Windows 10 Drivers Updated for Improved Gaming Performance
Your GPU (Graphics Processing Unit) is the core of your PC gaming experience. However, the GPU requires the latest Windows driver to keep it working faster and better.
All graphics cards, no matter how old or new, benefit from continually updated drivers.
To check your GPU name and specs:
Right-click
Desktop
Select
Display settings > Advanced display settings
At the bottom, find
Display adapter properties
You can download driver updates through this window under
Properties > Driver > Update Driver.
Alternatively, visit the manufacturer's website to ensure the driver is up-to-date.
Manufacturers will often provide free gaming and update software to keep your drivers up to date automatically. For optimal performance, it is highly recommended that you install the chipset and LAN drivers for your motherboard as well. Since these are crucial for optimal gaming performance, this makes sense.
The easiest method to check chipset drivers is to open Windows PowerShell (
right-click Start
to find it) and enter:
wmic baseboard get product,Manufacturer,version,serialnumber
Your motherboard's manufacturer and product name will appear in the command prompt.
List your manufacturer and product name to search for your drivers online. You should find the necessary software on the
Support
page of the manufacturer's website.
Along with the chipset drivers, you will also find your onboard LAN drivers for an optimal internet connection.
11. Install DirectX 12 to Optimize Windows 10 for Gaming
DirectX 12, the latest version of Microsoft's popular gaming API, is a key element of Windows 10 gaming.
It delivers support for multiple GPU and CPU cores, better frame rates, lowered power consumption, and enhanced graphical effects.
To check if you have the latest version of DirectX:
Open
Windows PowerShell
Type
dxdiag
Tap
Enter
Moments later, you'll see the DirectX Diagnostic Tool.
Don't have DirectX 12 installed? There's a small chance this can happen if you have upgraded from Windows 8.1. Fix this by:
Opening
Settings
with
Windows key + I
.
Select
Update and security
.
Find
Windows Update > Check for updates
.
That's it. Wait while the update installation gets completed. DirectX12 will automatically optimize many gaming settings in Windows 10.
Now You Know How to Optimize Your PC for Gaming
Windows 10 has been a major legitimate delight for the modern gamer. With a towering game selection, Xbox One compatibility, and software specifically designed for gaming, it's clear the gamer community has always had a special place for Windows 10. However, nothing's perfect. And that's exactly the reason Microsoft came up with Windows 11, a significant ramp-up for Windows gamers all over the world.