# Capacitor / WebView
-keep class com.getcapacitor.** { *; }
-keep class com.getcapacitor.plugin.** { *; }
-keepclassmembers class * { @com.getcapacitor.annotation.CapacitorPlugin *; }
-keepclassmembers class * { @com.getcapacitor.PluginMethod *; }
-keep public class * extends com.getcapacitor.Plugin
# Firebase Cloud Messaging (push)
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
